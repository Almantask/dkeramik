# 🏺 DKeramik – Parduotuvės valdymo gidas

Šis gidas skirtas studijos savininkui ir parduotuvės administratoriui. Čia paprasta kalba paaiškinta, kaip kasdien prižiūrėti užsakymus, keisti prekių kainas bei likučius, išrašyti sąskaitas ir atlikti nustatymų pakeitimus.

---

## 📋 Turinys
1. [Prisijungimas prie valdymo pulto (Admin)](#1-prisijungimas-prie-valdymo-pulto-admin)
2. [Kasdienė rutina: Užsakymų valdymas](#2-kasdienė-rutina-užsakymų-valdymas)
3. [Prekių likučiai ir kainos (Inventory)](#3-prekių-likučiai-ir-kainos-inventory)
4. [Naujo kūrinio įkėlimas į parduotuvę](#4-naujo-kūrinio-įkėlimas-į-parduotuvę)
5. [Parduotuvės nustatymai (Settings)](#5-parduotuvės-nustatymai-settings)
6. [Sąskaitos-faktūros ir buhalterija](#6-sąskaitos-faktūros-ir-buhalterija)
7. [Dažniausiai užduodami klausimai (DUK)](#7-dažniausiai-užduodami-klausimai-duk)
8. [Techninė informacija (programuotojui)](#8-techninė-informacija-programuotojui)

---

## 1. Prisijungimas prie valdymo pulto (Admin)

1. Naršyklėje atidarykite savo parduotuvės administravimo nuorodą:  
   👉 **`https://<jūsų-serverio-adresas>/admin/login`**
2. Įveskite administratoriaus slaptažodį ir paspauskite **Sign in**.
3. Viršutinėje juostoje matysite 3 pagrindinius skyrius:
   - **Orders** – visi gauti pirkėjų užsakymai ir sąskaitos.
   - **Inventory** – prekių kainos, likučiai sandėlyje ir pardavimo būsena.
   - **Settings** – banko sąskaita (IBAN), atsiėmimo adresas ir pristatymo kaina.

---

## 2. Kasdienė rutina: Užsakymų valdymas

Skyriuje **Orders** matysite visą pirkimų istoriją.

### Užsakymų būsenos:
* **`awaiting_payment` (Laukiama apmokėjimo)**:
  * Pirkėjas pateikė užsakymą, bet pinigai dar nepasiekė sąskaitos arba mokėjimas dar vykdomas.
* **`paid` (Apmokėta)**:
  * Užsakymas sėkmingai apmokėtas. Galite pakuoti ir siųsti kūrinį!
* **`cancelled` (Atšaukta)**:
  * Užsakymas buvo atšauktas (prekė automatiškai grąžinta į prekybą).

---

### Kaip pirkėjai atsiskaito?

#### A. Apmokėjimas per el. bankininkystę (Paysera)
* Pirkėjas iškart nukreipiamas į savo banką ir sumoka.
* Gavus apmokėjimą, sistema **automatiškai** pažymi užsakymą kaip **`paid`** ir išsiunčia PVM sąskaitą-faktūrą pirkėjui bei į studijos el. paštą. Jums nieko spausti nereikia!

#### B. Tiesioginis bankinis pavedimas (SEPA)
* Pirkėjas gauna sąskaitą ir atlieka pavedimą tiesiai į jūsų nurodytą banko sąskaitą (IBAN), mokėjimo paskirtyje nurodydamas sąskaitos numerį (pvz., `DK-2026-0001`).
* **Ką daryti jums:**
  1. Pasitikrinkite savo banko sąskaitos išrašą.
  2. Pamatę gautą pavedimą, admin lange prie atitinkamo užsakymo paspauskite mygtuką **`Mark paid`** (Pažymėti kaip apmokėtą).
  3. Užsakymas taps `paid` ir bus paruoštas vykdymui.

---

### Užsakymo atšaukimas
Jeigu pirkėjas persigalvojo arba per sutartą laiką neapmokėjo užsakymo:
1. Paspauskite mygtuką **`Cancel`** prie neapmokėto užsakymo.
2. Užsakymas bus atšauktas, o prekės likutis **automatiškai sugrįš į parduotuvę** (vėl taps prieinamas kitiems pirkėjams).

---

### Sąskaitų-faktūrų siuntimas ir atsisiuntimas
* **Atsisiųsti PDF:** Paspauskite **`PDF`** nuorodą prie užsakymo – sąskaita atsidarys naujame lange, kur galėsite ją atsispausdinti ar išsisaugoti.
* **Persiųsti pirkėjui:** Jei pirkėjas pametė laišką ar prašo pakartotinės sąskaitos, paspauskite **`Resend`** – sistema automatiškai iš naujo išsiųs sąskaitą pirkėjo el. pašto adresu.

---

## 3. Prekių likučiai ir kainos (Inventory)

Skyriuje **Inventory** valdote, kas šiuo metu parduodama ir kokiomis kainomis.

Kiekviena prekė turi šiuos laukelius:
* **Kaina centais (priceCents)**:
  * ⚠️ *Svarbu:* Kaina įvedama centais.
  * Pavyzdžiui: **€25.00** rašoma kaip **`2500`**, **€48.50** rašoma kaip **`4850`**, **€120.00** rašoma kaip **`12000`**.
* **Likutis (stock)**:
  * Turimas vienetų skaičius (pvz., `1`, `3`, `5`).
  * Kai prekė nuperkama, šis skaičius automatiškai sumažėja.
* **Prekyboje (for sale)**:
  * Pažymėta varnelė – prekė rodoma parduotuvėje ir pirkėjai gali ją įsidėti į krepšelį.
  * Nuimta varnelė – prekė parduotuvėje neparduodama (liks tik portfolio galerijoje, jei nustatyta).

> 💡 **Patarimas unikaliems vienetiniams rankų darbo kūriniams:**  
> Jei sukūrėte vienetinį indą ir jį pardavėte mugėje ar atidavėte dovanų – užeikite į **Inventory**, nustatykite **stock = 0** arba nuimkite varnelę **for sale** ir paspauskite **Save**. Taip išvengsite situacijos, kai internetu tą patį unikalų daiktą nuperka kitas žmogus.
> 
> 🔗 **Nuorodos į svetainę:**  
> Tiek **Inventory**, tiek **Orders** skyriuose paspaudę ant bet kurio kūrinio pavadinimo ar ID kodo, naujame naršyklės skirtuke iškart atidarysite to kūrinio puslapį svetainėje.

---

## 4. Naujo kūrinio įkėlimas į parduotuvę

Naujo kūrinio atsiradimą parduotuvėje sudaro du paprasti etapai: **kūrinio aprašymas svetainėje** ir **kainos bei likučio nustatymas valdymo pulte**.

```
   [1. Kūrinio duomenys] ────────▶ [2. Svetainės atnaujinimas] ────────▶ [3. Kaina ir likutis Admin]
 (Nuotraukos, istorija, SKU)          (Puslapis sugeneruojamas)            (Įvedama kaina centais ir kiekis)
```

---

### 1 Žingsnis: Kūrinio informacijos paruošimas
Kiekvienas gaminys svetainėje turi savo aprašymą (`content/products.ts` faile). Naujam kūriniui nurodoma:
* **Unikalus kodas (ID / SKU)**: Pvz., `tall-terracotta-vase` ir `DK-VASE-003`.
* **Kategorija**: Dubenėliai (`categoryBowls`), puodeliai (`categoryCups`), vazos (`categoryVases`) ar dekoras (`categorySmallDecor`).
* **Pavadinimas ir istorija**: Jaukus aprašymas lietuvių ir anglų kalbomis.
* **Nuotraukos**: Pagrindinė nuotrauka ir papildomi detalūs kadrai galerijai.
* **Matmenys ir medžiagos**: Pvz., *„12 cm × 25 cm“*, *„Akmens masės molis su matine glazūra“*.
* **Priežiūra**: Plovimo ir naudojimo rekomendacijos.
* **Ar parduodama (`forSale`)**: Nustatoma `true` (jei kūrinys bus parduodamas parduotuvėje).

---

### 2 Žingsnis: Kainos ir likučio nustatymas valdymo pulte (Admin)
Kai svetainė atnaujinama:
1. Prisijunkite prie valdymo pulto: **`/admin/login`**.
2. Eikite į skyrių **Inventory**.
3. Sąraše suraskite savo naują kūrinį (pagal pavadinimą ar SKU kodą).
4. Įveskite:
   - **Kainą centais (`priceCents`)**: pvz., jei kaina yra **38.00 €**, įrašykite **`3800`**.
   - **Turimą kiekį (`stock`)**: pvz., **`1`** (jei tai vienetinis darbas) arba **`3`**.
   - Pažymėkite varnelę **`for sale`** (prekyboje).
5. Paspauskite **Save**.

🎉 **Viskas!** Kūrinys iškart atsiranda parduotuvės vitrinoje, o pirkėjai gali jį įsidėti į krepšelį ir nusipirkti.

---

### 💡 Portfolio kūriniai (be pardavimo mygtuko)
Jei norite parodyti kūrinį savo portfolio galerijoje, bet šiuo metu jo neparduodate:
* Nustatykite `forSale: false` arba valdymo pulte nuimkite varnelę **`for sale`**.
* Kūrinio nuotraukos ir istorija bus matomos lankytojams portfolio puslapyje, tačiau kaina ir mygtukas „Pirkti“ nebus rodomi.

---

## 5. Parduotuvės nustatymai (Settings)

Skyriuje **Settings** galite bet kada atnaujinti pagrindinius studijos rekvizitus:

| Laukelis | Paskirtis | Pavyzdys |
| :--- | :--- | :--- |
| **IBAN** | Banko sąskaitos numeris pavedimams | `LT12 7044 0000 1234 5678` |
| **Seller name** | Studijos arba autoriaus vardas, pavardė / pavadinimas | `DKeramik / Dovilė Keramikė` |
| **Seller address** | Oficialus studijos adresas (rodomas sąskaitose) | `Vilniaus g. 10, Kaunas` |
| **Pickup address** | Adresas, kur pirkėjas gali atvykti atsiimti kūrinio | `Studija „DKeramik“, Vilniaus g. 10, Kaunas` |
| **LT shipping cents** | Siuntimo kaina Lietuvoje (centais) | `450` *(tai reiškia €4.50)* |

Atlikę pakeitimus, nepamirškite paspausti **Save**. Pakeitimai iškart įsigalios naujiems užsakymams ir sąskaitoms.

---

## 6. Sąskaitos-faktūros ir buhalterija

### Kaip veikia sąskaitos?
* Kiekvienam pirkimui automatiškai sugeneruojama tvarkinga PDF sąskaita su unikaliu numeriu (pvz., `DK-2026-0001`).
* Sąskaita automatiškai išsiunčiama pirkėjui ir kopija į `info@dkeramik.lt`.
* Visos sąskaitos saugiai saugomos archyve ir yra pasiekiamos iš **Orders** puslapio.

### Mokesčiai ir apskaita (Individuali veikla):
* **Pajamų–išlaidų žurnalas:**  
  Ši sistema automatiškai nesiunčia duomenų tiesiai į VMI i.APS sistemą. Mėnesio pabaigoje arba periodiškai peržiūrėkite apmokėtus užsakymus ir įrašykite pajamas į savo individualios veiklos pajamų žurnalą.
* **PVM (Pridėtinės vertės mokestis):**  
  Kol bendros pajamos neviršija PVM nustatytos ribos (~45 000 €/metus) ir nesate registruotas PVM mokėtoju, sąskaitose automatiškai nurodoma: **„PVM netaikomas pagal PVM įstatymą“**. Kainose PVM neišskiriamas.
* **Apmokėjimas grynaisiais:**  
  Rekomenduojama atsiėmimo vietoje grynųjų pinigų nepriimti (paprašykite pirkėjo atlikti pavedimą arba atsiskaityti per el. bankininkystę), kad nereikėtų naudoti kasos aparato ar pildyti kasos pajamų orderių (KPO).

---

## 7. Dažniausiai užduodami klausimai (DUK)

### ❓ Pirkėjas atliko pavedimą, bet mokėjimo paskirtyje neįrašė sąskaitos numerio arba padarė klaidą?
Nieko baisaus! Jei matote gautą sumą savo banko išraše ir atpažįstate pirkėją pagal vardą ar sumą, tiesiog atidarykite **Orders**, suraskite tą užsakymą ir paspauskite **`Mark paid`**.

### ❓ Pirkėjas nori atšaukti neapmokėtą užsakymą?
Skyriuje **Orders** prie to užsakymo paspauskite **`Cancel`**. Užsakymas bus anuliuotas, o prekė automatiškai grįš į prekybą.

### ❓ Ar gali du pirkėjai vienu metu nupirkti tą patį vienetinį kūrinį?
Ne. Parduotuvės sistema turi apsaugą – pirkimo momentu tikrinamas realus likutis. Jei kūrinys likęs tik 1 vnt., jį nusipirkti spės tik pirmasis pirkėjas, o antrajam sistema praneš, kad prekės jau nebėra.

### ❓ Kas nutinka, jei laikinai išjungta Paysera el. bankininkystė?
Parduotuvė automatiškai persijungia į saugų tiesioginio bankinio pavedimo (SEPA) režimą. Pirkėjai ekrane ir el. paštu gauna sąskaitą su jūsų nurodytu IBAN numeriu.

---

## 8. Techninė informacija (programuotojui)

<details>
<summary>Spustelėkite čia, jei esate sistemos administratorius ar programuotojas</summary>

### Architektūra
* **Svetainė**: Next.js 14 statinis eksportas GitHub Pages.
* **API / Admin / Likučiai**: Google Cloud Run tarnyba `dkeramik-api` (`europe-central2`, projektas `dkeramik-fullstack`).
* **Duomenų bazė**: Google Firestore (užsakymai, likučiai, nustatymai).
* **Sąskaitų saugykla**: Google Cloud Storage (`dkeramik-fullstack-invoices`).

### Svarbūs nustatymai ir Secret Manager
* `ADMIN_PASSWORD`: Slaptažodis prisijungimui prie `/admin/login`.
* `SESSION_SECRET`: Sesijų šifravimo raktas.
* `WEBHOOK_SECRET`: Vidinio webhook ryšio raktas.
* `PAYSERA_PROJECT_ID` ir `PAYSERA_PASSWORD`: Paysera integracija (jei tuščia, Paysera automatiškai išjungiama ir naudojamas tik SEPA režimas).
* Paysera callback URL: `https://<api-domain>/api/webhooks/paysera`.

### Žurnalų tikrinimas (Logs)
Jei reikia patikrinti serverio klaidas ar Paysera callback įvykius:
```bash
gcloud run logs read --project=dkeramik-fullstack --region=europe-central2 --limit=50
```

### Vietinis paleidimas (Development)
```bash
cd backend
npm run dev # Paleidžia vietinį serverį su atminties saugykla (localhost:8787)
```
</details>
