# Parduotuvės valdymas

Vieša svetainė lieka statinė GitHub Pages. Kainos, likučiai, sąskaitos ir apmokėjimo aptikimas — Cloud Run tarnyba `dkeramik-api` GCP projekte **dkeramik-fullstack**, regione **europe-central2**.

## Kasdienybė

1. Admin: `https://<run-url>/admin/login` (slaptažodis Secret Manager `ADMIN_PASSWORD`).
2. **Inventory** — keiskite likutį, kainą (centais) ir `forSale`. Po pirmo seed admin yra tiesos šaltinis.
3. Unikalų kūrinį pardavus — stock `0` arba nuimkite from sale.
4. **Orders** — pirkėjas moka Paysera banko nuoroda (0% LT PIS). Webhook pažymi **paid**. Jei pavedė SEPA į IBAN su klaida paskirtyje — **Mark paid**. Niekuomet nežymėkite du kartus; apmokėtas užsakymas likučio negrąžina.
5. **Cancel** neapmokėtą užsakymą — likutis grįžta. Vėlyvas webhook atmetamas.
6. PDF — el. paštas, admin, GCS. **Resend** persiunčia sąskaitą.

## Naujas portfolio kūrinys pardavimui

1. `content/products.ts`: `forSale: true` ir `sku`.
2. Deploy Pages.
3. Sukurkite `inventory` įrašą (tuščias Firestore seed arba ranka admin). Kaina ir likutis nėra gite.

Portfolio kaina ir pirkimo mygtukas nerodomi.

## Paysera

- Checkout Modern, tik bankų nuorodos (be kortelių), jei norite €0 procesoriaus mokesčio.
- Callback: `https://<api>/api/webhooks/paysera`.
- Parašas HMAC, suma ≥ sąskaita, EUR, `callback_id` idempotencija.
- Neprimokėta — laukia, later. Permokėta — paid + later.
- Rankinis SEPA: IBAN + paskirtis = sąskaitos numeris.
- **Išjungta, jei nėra nustatyti slaptažodžiai**: Jei `PAYSERA_PROJECT_ID` arba `PAYSERA_PASSWORD` nėra nustatyti Secret Manager ar aplinkoje, Paysera mokėjimai automatiškai išjungiami, o parduotuvė veikia įprastu bankinio pavedimo (SEPA) režimu.

Neatsitiko auto-match: `gcloud run logs read --project=dkeramik-fullstack --region=europe-central2` ir Paysera callback žurnalas.

## VMI / PVM

Sąskaitos nepaduodamos į i.APS automatiškai. Sumas perkelkite į pajamų–išlaidų žurnalą. Kol nesate PVM mokėtojas (~45 tūkst. € riba), faktūroje **PVM netaikomas**. Grynųjų atsiėmimo metu neimkite, jei nenorite kasos aparato. Tai nėra teisinė konsultacija.

## Cloud Run

Projektas `dkeramik-fullstack`, min instances 0, GitHub Actions `deploy-api.yml`. Vietoje: `cd backend && npm run dev`.
