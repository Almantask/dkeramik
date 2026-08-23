# Shop management (English)

This site stays static on GitHub Pages. Price, stock, invoices, and paid-detection live on Cloud Run (`dkeramik-api` in GCP project **dkeramik-fullstack**, region **europe-central2**).

## Daily flow

1. Open the admin UI: `https://<your-run-url>/admin/login` (password from Secret Manager `ADMIN_PASSWORD`).
2. **Inventory** — change stock, price (cents), and `forSale`. Admin is the source of truth after the first seed.
3. When a unique piece sells, set stock to `0` or uncheck for sale so the shop cannot oversell.
4. **Orders** — unpaid orders wait for Paysera. When the bank link succeeds, a webhook marks the invoice **paid** (`paidVia: paysera`). If a buyer SEPA-transfers to the IBAN with a typo in the purpose, use **Mark paid** (`paidVia: manual`). Never mark paid twice; paid orders do not restock.
5. **Cancel** an unpaid order to restore stock. A late webhook on a cancelled order is rejected.
6. Download or **Resend** the PDF invoice from the order row.

## New portfolio piece that should be shoppable

1. Add the object in `content/products.ts` with `forSale: true` and a `sku`.
2. Deploy GitHub Pages.
3. Seed or create the matching `inventory/{id}` row (restart with empty Firestore, or add the row in admin after deploy). Price and stock are not taken from git.

Portfolio pages never show price or a buy button.

## Payments (Paysera, 0% Lithuanian bank links)

- Enable **bank links only** in Paysera Checkout (no cards) to keep processor fees at €0.
- Callback URL: `https://<api>/api/webhooks/paysera`.
- Matching: HMAC signature, amount ≥ invoice total in cents, EUR, idempotent `callback_id`.
- Underpay: stays `awaiting_payment`, flagged underpaid. Overpay: marked paid, flagged overpaid.
- Manual SEPA: IBAN + payment purpose = invoice number (`DK-YYYY-0001`) on the PDF.
- **Disabled when secrets are unset**: If `PAYSERA_PROJECT_ID` or `PAYSERA_PASSWORD` are not configured in Secret Manager / environment, Paysera payment links are automatically disabled and the shop operates in manual SEPA transfer mode.

If a payment did not auto-match: Cloud Run logs (`gcloud run logs read --project=dkeramik-fullstack --region=europe-central2`) and Paysera project callbacks. Do not double-mark paid.

## PDFs and books

PDFs are emailed to the buyer and `info@dkeramik.lt`, shown in admin, and stored in GCS bucket `dkeramik-fullstack-invoices`. Copy totals into the pajamų–išlaidų žurnalas; this app does not file i.APS / VMI.

## Tax (not legal advice)

- Individuali veikla: GPM, VSD, PSD are unchanged by Paysera vs SEPA.
- Stay under the ~€45k PVM threshold unless you register. Invoices say **PVM netaikomas** until you are a VAT payer. Do not add 21% in admin until then.
- 30% deemed expenses vs real expenses: ask your accountant.
- Do not take cash at pickup if you want to skip a kasos aparatas.

## Settings

IBAN, pickup address, and Lithuania flat shipping (cents) are edited under **Settings**. Placeholders belong in Secret Manager / admin, not in git.

## Cloud Run

- Project `dkeramik-fullstack`, service `dkeramik-api`, min instances 0.
- GitHub Actions `.github/workflows/deploy-api.yml` builds the image to Artifact Registry and deploys on `backend/**` changes.
- Idle cost is typically cents to ~€0/month (Firestore + scale-to-zero). Avoid Cloud SQL.
- Local API: `cd backend && npm run dev` (memory store). Optional: `docker compose up api`.

## Stock desync

Adjust stock in admin. Do not sell the same unique piece twice. If two browsers race, the API transaction allows only one successful order.
