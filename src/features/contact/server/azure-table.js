import { createHmac } from "node:crypto";

const TABLE_API_VERSION = "2020-12-06";

function getStorageSettings() {
  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const table = process.env.AZURE_STORAGE_TABLE_NAME || "Enquiries";
  if (!account || /^(replace|example)/i.test(account) || !/^[a-z0-9]{3,24}$/.test(account))
    return null;
  if (!/^[A-Za-z][A-Za-z0-9]{2,62}$/.test(table)) return null;
  return { account, table };
}

async function getManagedIdentityToken() {
  const endpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  let response;

  if (endpoint && identityHeader) {
    const tokenUrl = new URL(endpoint);
    tokenUrl.searchParams.set("resource", "https://storage.azure.com/");
    tokenUrl.searchParams.set("api-version", "2019-08-01");
    response = await fetch(tokenUrl, {
      headers: { "X-IDENTITY-HEADER": identityHeader },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
  } else if (process.env.AZURE_USE_VM_MANAGED_IDENTITY === "true") {
    const tokenUrl = new URL("http://169.254.169.254/metadata/identity/oauth2/token");
    tokenUrl.searchParams.set("resource", "https://storage.azure.com/");
    tokenUrl.searchParams.set("api-version", "2018-02-01");
    if (process.env.AZURE_VM_MANAGED_IDENTITY_CLIENT_ID) {
      tokenUrl.searchParams.set("client_id", process.env.AZURE_VM_MANAGED_IDENTITY_CLIENT_ID);
    }
    response = await fetch(tokenUrl, {
      headers: { Metadata: "true" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
  } else {
    return null;
  }

  if (!response.ok) throw new Error("Azure managed identity token request failed.");
  const tokenResponse = await response.json();
  if (!tokenResponse.access_token) throw new Error("Azure managed identity returned no token.");
  return tokenResponse.access_token;
}

function createSharedKeyAuthorization(account, key, date, table) {
  const stringToSign = `${date}\n/${account}/${table}`;
  const signature = createHmac("sha256", Buffer.from(key, "base64"))
    .update(stringToSign, "utf8")
    .digest("base64");
  return `SharedKeyLite ${account}:${signature}`;
}

export async function insertEnquiry(enquiry) {
  const settings = getStorageSettings();
  if (!settings) throw new Error("Azure enquiry storage is not configured.");

  const date = new Date().toUTCString();
  const token = await getManagedIdentityToken();
  const headers = {
    Accept: "application/json;odata=nometadata",
    "Content-Type": "application/json;odata=nometadata",
    "x-ms-date": date,
    "x-ms-version": TABLE_API_VERSION,
    DataServiceVersion: "3.0;NetFx",
    MaxDataServiceVersion: "3.0;NetFx",
    Prefer: "return-no-content",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    const key = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    if (!key || key.startsWith("example-only-")) {
      throw new Error("Azure storage credentials are not configured.");
    }
    headers.Authorization = createSharedKeyAuthorization(
      settings.account,
      key,
      date,
      settings.table,
    );
  }

  const endpoint = `https://${settings.account}.table.core.windows.net/${settings.table}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(enquiry),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok) {
    const error = new Error("Azure rejected the enquiry write.");
    error.status = response.status;
    throw error;
  }
}
