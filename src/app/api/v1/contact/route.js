import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { insertEnquiry } from "../../../../features/contact/server/azure-table";

export const runtime = "nodejs";

const ALLOWED_TOPICS = new Set([
  "Digital product engineering",
  "Cloud & platform",
  "Data & intelligent systems",
  "Technology advisory",
  "Something else",
]);

function cleanString(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.APP_ORIGIN || request.nextUrl.origin;
  if (!origin || origin !== new URL(expectedOrigin).origin) {
    return NextResponse.json(
      { error: { code: "INVALID_ORIGIN", message: "This enquiry request could not be verified." } },
      { status: 403 },
    );
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 8192) {
    return NextResponse.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "The enquiry is too large." } },
      { status: 413 },
    );
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Please submit a valid enquiry." } },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Please submit a valid enquiry." } },
      { status: 400 },
    );
  }

  const name = cleanString(body.name, 120);
  const email = cleanString(body.email, 254).toLowerCase();
  const company = cleanString(body.company, 160);
  const topic = cleanString(body.topic, 100);
  const message = cleanString(body.message, 4000);
  if (!name || !isValidEmail(email) || !ALLOWED_TOPICS.has(topic) || message.length < 10) {
    return NextResponse.json(
      { error: { code: "VALIDATION_FAILED", message: "Check the required fields and try again." } },
      { status: 400 },
    );
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: { code: "CONSENT_REQUIRED", message: "Consent is required to send this enquiry." } },
      { status: 400 },
    );
  }
  if (cleanString(body.website, 200)) {
    return NextResponse.json({ data: { accepted: true } }, { status: 201 });
  }

  const createdAt = new Date();
  const rowKey = randomUUID();
  try {
    await insertEnquiry({
      PartitionKey: createdAt.toISOString().slice(0, 7).replace("-", ""),
      RowKey: rowKey,
      Name: name,
      Email: email,
      Company: company || undefined,
      Topic: topic,
      Message: message,
      Consent: true,
      CreatedAt: createdAt.toISOString(),
      SubmissionSource: "website",
    });
    return NextResponse.json(
      { data: { id: rowKey, submittedAt: createdAt.toISOString() } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "ENQUIRY_STORAGE_UNAVAILABLE",
          message: "We could not save your enquiry. Please try again later.",
        },
      },
      { status: 503 },
    );
  }
}
