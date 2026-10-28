# Omnext Technologies website

Responsive public website for Omnext Technologies, built with Next.js App Router, React, JavaScript/JSX, and CSS Modules. The shared design system, layout, routes, search and enquiry-form experience are implemented in `src/`.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Useful commands: `npm run dev`, `npm run lint`, `npm run build`, `npm start`, `npm run format`, and `npm run format:check`.

## Routes

- `/` — company home page.
- `/products` — protected product and technology capabilities.
- `/solutions` — protected modernization, product launch and digital scale areas.
- `/about` — public company story, mission, values and working approach.
- `/blog` and `/blog/[slug]` — insights listing and article details.
- `/contact` — accessible, browser-validated enquiry form.
- `/search` — client-side search over the current public capabilities, solutions and articles.
- `/website-development` and `/software-development` — public service pages for search discovery.

The shared UI components live in `src/components/` with their CSS Modules alongside. Route-specific views and styles live under `src/app/`; article and searchable content lives in `src/features/articles/`.

## Environment

`NEXT_PUBLIC_SITE_URL` sets the public origin used by metadata, while server-only `APP_ORIGIN` is the canonical origin used for auth redirects and request-origin checks. All API routes are same-origin Next.js Route Handlers under `/api/v1`; no Express service or `NEXT_PUBLIC_API_URL` is required. Set `AUTH_SESSION_SECRET` in the ignored `.env.local`; use at least 32 random characters and keep it server-only—never prefix it with `NEXT_PUBLIC_`. Registered sign-in also needs `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`, `ENTRA_REDIRECT_URI` (`http://localhost:3000/api/v1/auth/callback` locally), and `ENTRA_OIDC_METADATA_URL` from the External ID user flow.

The home page, `/about`, `/blog` and article details, `/contact`, `/search`, and the focused website/software-development pages are public for discovery and lead generation. `/products`, `/solutions`, and every other non-public page require a valid signed session through the Next.js Proxy. Guests can open protected pages in read-only mode, and their signed session expires after two minutes. Next.js Route Handlers provide health, guest, session, logout, contact submission, and Entra OIDC routes. Registered Entra External ID sign-in uses the hosted user flow for email/password plus OTP and configured Google/Microsoft federation options. Passwords are handled by the identity providers and are never stored in Omnext. User appearance preference currently persists in browser storage; account sync needs a user profile data store.

### Configure sign-in in Azure

The app uses one Entra External ID hosted sign-up/sign-in flow. Entra is the credential directory for email/password users. Google and Microsoft verify their own users through federation; Omnext never stores provider passwords.

1. Create/select an **External ID tenant** and a **sign-up and sign-in** user flow with **Email with password**.
2. Register an app in that tenant as a **Web** app. Add `http://localhost:3000/api/v1/auth/callback` as the local redirect URI, then create a client secret and copy its Value.
3. Associate the app with the flow. Under **Run user flow**, select this app and copy the OpenID configuration URL.
4. Enable **Email OTP** under Authentication methods. Apply a Conditional Access policy requiring MFA to the app/flow so email/password sign-ins receive the OTP challenge.
5. To add Google, create a Google Cloud OAuth consent screen and Web client. In the Google client, add the External ID callback URLs from the [Google federation guide](https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-google-federation-customers). Configure its client ID/secret in **External Identities → All identity providers → Built-in → Google**.
6. To add Microsoft personal accounts, create an identity-provider app registration supporting organizational and personal accounts. Configure the External ID federation redirect URIs, then add the provider under **External Identities → All identity providers → Custom → Add new → Open ID Connect**. Use discovery `https://login.microsoftonline.com/consumers/v2.0/.well-known/openid-configuration`, issuer `https://login.live.com`, scope `openid profile email`, response type `code`, and the app's client ID/secret. See the [Microsoft account federation guide](https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-microsoft-accounts-federation-customers).
7. In the sign-up/sign-in user flow's **Settings → Identity providers**, add Google and Microsoft account, save, then test the flow. These options appear on Microsoft's hosted method picker. Microsoft account here means personal accounts; work/school federation is separate.

Copy `.env.example` to `.env.local`. Set `AUTH_SESSION_SECRET` to a new random value of at least 32 characters, then set `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`, `ENTRA_REDIRECT_URI=http://localhost:3000/api/v1/auth/callback`, and `ENTRA_OIDC_METADATA_URL` to the URL copied from Azure. Keep the client secret and session secret server-only. For production, add the production callback URI in Azure and place secrets in Azure App Service settings or Key Vault references. There is no `NEXT_PUBLIC_API_URL` and no separate API server.

### Configure Azure enquiry storage

Enquiries are stored in Azure Table Storage. The contact form is public so prospective customers can reach Omnext without creating an account. The API checks request origin, validates fields server-side, requires consent, and includes a honeypot field to screen basic automated submissions.

1. Create a general-purpose v2 **Storage account** in the Azure region you use for the app.
2. Under **Storage browser → Tables**, create a table named `Enquiries` (the name must match `AZURE_STORAGE_TABLE_NAME`).
3. Enable **System assigned managed identity** on the hosting resource (App Service or Linux VM).
4. On the storage account, open **Access control (IAM)** and assign **Storage Table Data Contributor** to that hosting identity. Scope the role to the storage account (or the table where the portal allows it). Azure's storage data roles are separate from the management-plane Owner/Contributor roles.
5. Set the App Service application settings listed below. App Service uses its managed identity automatically. On a Linux VM, set `AZURE_USE_VM_MANAGED_IDENTITY=true` (and `AZURE_VM_MANAGED_IDENTITY_CLIENT_ID` only for a user-assigned identity). Do not set a storage account key on either Azure host. In local development only, you can set `AZURE_STORAGE_ACCOUNT_KEY` in ignored `.env.local` if you want to test writes directly from your machine.
6. View received enquiries in **Storage browser → Tables → Enquiries**. The app stores submissions; it does not send an email notification yet.

Microsoft references: [authorize Table Storage with Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/storage/tables/authorize-access-azure-active-directory), [App Service managed identity](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity), [Storage Table Data Contributor role](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/storage).

### Production App Service settings

Create a **Linux Web App** using the Node.js 24 LTS runtime. Deploy the `omnext-web` project as a server-rendered Next.js app; do not use static export. Set these values under **App Service → Settings → Environment variables** (and set `NEXT_PUBLIC_SITE_URL` in the CI build environment too, before `next build`):

```text
NODE_ENV=production
APP_ORIGIN=https://YOUR_PUBLIC_DOMAIN
NEXT_PUBLIC_SITE_URL=https://YOUR_PUBLIC_DOMAIN
AUTH_SESSION_SECRET=<unique random secret, at least 32 characters>
ENTRA_CLIENT_ID=<External ID web app client ID>
ENTRA_CLIENT_SECRET=<External ID web app secret VALUE>
ENTRA_REDIRECT_URI=https://YOUR_PUBLIC_DOMAIN/api/v1/auth/callback
ENTRA_OIDC_METADATA_URL=<OpenID configuration URL copied from the user flow>
AZURE_STORAGE_ACCOUNT_NAME=<lowercase storage account name>
AZURE_STORAGE_TABLE_NAME=Enquiries
```

Add the same production callback URI to the Entra **Web** app registration. Store `AUTH_SESSION_SECRET` and `ENTRA_CLIENT_SECRET` as Key Vault references if you use Key Vault; never add real values to `.env.example`, GitHub, or client-side `NEXT_PUBLIC_*` variables. The App Service's managed identity token endpoint is used automatically for Table Storage. Deploy/restart after adding settings. Test `/api/v1/health`, register/sign in through Entra, submit a contact enquiry, and confirm a new row appears in the `Enquiries` table. App Service Node runtime guidance: [configure Node.js](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs).

## Content notes

Article titles and copy are illustrative sample content for the prototype. Company story and service descriptions are introductory positioning, not claims of client work, certifications, awards, partnerships, results, or company registration. No external stock imagery, logos, font downloads, or third-party API calls are used.

The contact form validates in the browser and on the server, accepts public consented enquiries, and stores them in Azure Table Storage. The Omnext team can review submissions in the `Enquiries` table in Azure Storage Browser. Search currently indexes the local public content catalogue.

## Accessibility and design

The interface uses semantic landmarks, keyboard-visible focus, labelled form controls, responsive navigation, reduced-motion support, a system/light/dark appearance selector, and page-specific metadata. The palette and type choices are CSS tokens in `src/app/globals.css`; replace the text-based brand mark with an approved logo when available.
