# 🏺 DKeramik – Shop Management Guide

This guide is designed for the studio owner and shop manager. It explains in simple terms how to manage customer orders, update product prices and stock quantities, issue invoices, and update store settings.

---

## 📋 Table of Contents
1. [Logging into the Admin Dashboard](#1-logging-into-the-admin-dashboard)
2. [Daily Routine: Managing Orders & Payments](#2-daily-routine-managing-orders--payments)
3. [Managing Stock & Prices (Inventory)](#3-managing-stock--prices-inventory)
4. [Adding a New Handcrafted Piece to the Shop](#4-adding-a-new-handcrafted-piece-to-the-shop)
5. [Store Settings](#5-store-settings)
6. [Invoices & Bookkeeping](#6-invoices--bookkeeping)
7. [Frequently Asked Questions (FAQ)](#7-frequently-asked-questions-faq)
8. [Technical Appendix (For Developers / Sysadmins)](#8-technical-appendix-for-developers--sysadmins)

---

## 1. Logging into the Admin Dashboard

1. In your web browser, open your store administration URL:  
   👉 **`https://<your-admin-url>/admin/login`**
2. Enter your administrator password and click **Sign in**.
3. In the top navigation bar, you will see 3 main sections:
   - **Orders** – All customer orders, payment statuses, and invoices.
   - **Inventory** – Product prices, available stock, and on-sale toggles.
   - **Settings** – Bank account (IBAN), pickup address, and shipping fees.

---

## 2. Daily Routine: Managing Orders & Payments

Under **Orders**, you can view the complete history of customer purchases.

### Order Statuses:
* **`awaiting_payment`**:
  * The customer placed an order, but payment has not yet been confirmed.
* **`paid`**:
  * The order has been paid in full. The ceramics are ready to be carefully packed and delivered!
* **`cancelled`**:
  * The order was cancelled. (Stock has been automatically returned to the shop).

---

### How Customers Pay

#### A. Online Bank Transfer (Paysera Bank Link)
* The customer is automatically redirected to their bank to complete the payment during checkout.
* Once paid, the system **automatically** updates the order status to **`paid`** and emails the official PDF invoice to both the customer and `info@dkeramik.lt`. You don't need to do anything manually!

#### B. Direct Bank Transfer (SEPA / Manual Wire)
* The customer receives an invoice on screen and by email, then transfers the amount directly to your studio's IBAN, using the invoice number (e.g., `DK-2026-0001`) in the payment purpose.
* **What you need to do:**
  1. Check your bank statement for incoming payments.
  2. When you see the payment, find the order in the admin dashboard and click the **`Mark paid`** button.
  3. The order status changes to `paid` and is ready for fulfillment.

---

### Cancelling an Order
If a customer changes their mind or fails to transfer the funds within an agreed period:
1. Click the **`Cancel`** button next to the unpaid order.
2. The order will be cancelled, and the item's stock will **automatically be restored to the store** for other customers to purchase.

---

### Invoices (Download & Resend)
* **Download PDF:** Click the **`PDF`** link next to any order to view, download, or print the invoice.
* **Resend to Customer:** If a customer lost their confirmation email or requested an extra copy, click **`Resend`** to immediately re-email the invoice to their email address.

---

## 3. Managing Stock & Prices (Inventory)

In the **Inventory** section, you control what is currently available for purchase and at what price.

Each item has the following editable fields:
* **Price in Cents (`priceCents`)**:
  * ⚠️ *Note:* Prices are entered in euro cents.
  * Examples: **€25.00** is entered as **`2500`**, **€48.50** is entered as **`4850`**, **€120.00** is entered as **`12000`**.
* **Stock Quantity (`stock`)**:
  * Number of available pieces (e.g., `1`, `3`, `5`).
  * When a customer completes a purchase, this count decreases automatically.
* **For Sale (`for sale`)**:
  * **Checked:** The product is visible in the shop and can be purchased.
  * **Unchecked:** The product cannot be purchased (it remains visible in the portfolio gallery if configured).

> 💡 **Tip for One-of-a-Kind Ceramics:**  
> If you sell a unique piece at an in-person exhibition or gift it to a friend, go to **Inventory**, set **stock to `0`** or uncheck **`for sale`**, and click **Save**. This prevents customers online from accidentally buying an item that is no longer in the studio.
> 
> 🔗 **Direct Links to the Website:**  
> In both **Inventory** and **Orders**, clicking on any product name or ID code opens that item's public website page in a new browser tab.

---

## 4. Adding a New Handcrafted Piece to the Shop

Adding a new ceramic creation to your shop involves two simple steps: **adding the piece's information to the website**, and **setting its price and stock in the Admin Dashboard**.

```
   [1. Product Details] ────────▶ [2. Website Update] ────────▶ [3. Price & Stock in Admin]
 (Photos, story, SKU, dimensions)     (Page is generated)          (Enter price in cents & quantity)
```

---

### Step 1: Prepare the Product Information
Each piece has its visual presentation defined in the website product catalog (`content/products.ts`). A new piece includes:
* **Unique Code (ID / SKU)**: e.g. `tall-terracotta-vase` and `DK-VASE-003`.
* **Category**: Bowls (`categoryBowls`), cups (`categoryCups`), vases (`categoryVases`), or small decor (`categorySmallDecor`).
* **Name & Poetic Story**: Warm titles and descriptions in both Lithuanian and English.
* **Photos**: Main product photo and additional detail shots for the gallery.
* **Dimensions & Materials**: e.g., *"12 cm × 25 cm"*, *"Stoneware clay with satin matte glaze"*.
* **Care Instructions**: Dishwasher / hand-washing recommendations.
* **For Sale (`forSale`)**: Set to `true` (if it will be available for purchase in the store).

---

### Step 2: Set Price and Quantity in Admin
Once the website is updated:
1. Log into your Admin Dashboard: **`/admin/login`**.
2. Click the **Inventory** tab.
3. Locate your new piece in the list (by its title or SKU).
4. Enter:
   - **Price in cents (`priceCents`)**: e.g. if the price is **€38.00**, enter **`3800`**.
   - **Available stock (`stock`)**: e.g. **`1`** (for a unique one-off piece) or **`3`**.
   - Check the **`for sale`** box.
5. Click **Save**.

🎉 **You're done!** The item is immediately available in the online shop for visitors to view, add to cart, and purchase.

---

### 💡 Portfolio Pieces (Without Buy Buttons)
If you want to exhibit a piece in your portfolio gallery without putting it up for sale:
* Set `forSale: false` or uncheck the **`for sale`** box in the admin dashboard.
* Visitors will see its photos, story, and dimensions in the portfolio gallery, but no price or "Buy" button will be displayed.

---

## 5. Store Settings

Under **Settings**, you can update your studio's operational details at any time:

| Field | Purpose | Example |
| :--- | :--- | :--- |
| **IBAN** | Bank account number for incoming bank transfers | `LT12 7044 0000 1234 5678` |
| **Seller name** | Studio or artisan name (displayed on invoices) | `DKeramik / Dovilė Keramikė` |
| **Seller address** | Studio legal address | `Vilniaus g. 10, Kaunas, Lithuania` |
| **Pickup address** | Location where customers can pick up their orders | `Studio DKeramik, Vilniaus g. 10, Kaunas` |
| **LT shipping cents** | Flat shipping rate within Lithuania (in cents) | `450` *(meaning €4.50)* |

After updating any fields, click **Save**. Changes take effect immediately on all subsequent orders and invoices.

---

## 6. Invoices & Bookkeeping

### How Invoices Work
* A professional PDF invoice with sequential numbering (e.g., `DK-2026-0001`) is generated for every order.
* A copy is automatically sent to the buyer and archived in `info@dkeramik.lt`.
* All invoices are permanently stored and can be downloaded anytime from the **Orders** page.

### Taxes & Accounting (Lithuanian Individual Activity / Freelance):
* **Income/Expense Journal (*Pajamų–išlaidų žurnalas*):**  
  The website does not submit automated declarations directly to the tax authority (VMI i.APS). Simply record your monthly sales totals from the admin orders into your standard revenue log.
* **VAT (PVM):**  
  Unless your annual revenue exceeds the national VAT registration threshold (~€45,000) or you have voluntarily registered as a VAT payer, your invoices will automatically display **"PVM netaikomas" (VAT not applicable)**.
* **Cash Payments:**  
  We recommend requiring prepayment (via online bank link or direct transfer) even for local studio pickups. This avoids the legal requirement of maintaining a physical cash register (*kasos aparatas*).

---

## 7. Frequently Asked Questions (FAQ)

### ❓ A customer transferred money by bank wire, but forgot the invoice number in the payment details. What should I do?
No problem! If you can see the payment in your bank account and match the buyer by name or exact amount, simply go to **Orders**, locate their order, and click **`Mark paid`**.

### ❓ A customer wants to cancel their order before paying. How do I handle this?
Go to **Orders** and click **`Cancel`** next to their order. The order is marked as cancelled and the ceramic piece is automatically made available again in the shop.

### ❓ Can two customers buy the same unique piece at the exact same moment?
No. The checkout system is protected with real-time stock checks. If there is only 1 piece available, the first customer to confirm checkout reserves the piece, and the second customer will be informed that the item is sold out.

### ❓ What happens if Paysera online banking is temporarily disabled or not configured?
The shop automatically falls back to direct bank transfer (SEPA) mode. Customers will receive an invoice with your studio's IBAN account details on screen and by email.

---

## 8. Technical Appendix (For Developers / Sysadmins)

<details>
<summary>Click here for server details, deployment instructions, and cloud configuration</summary>

### System Architecture
* **Frontend**: Next.js 14 static export hosted on GitHub Pages.
* **API / Admin / Inventory**: Google Cloud Run service `dkeramik-api` (`europe-central2` in GCP project `dkeramik-fullstack`).
* **Database**: Google Cloud Firestore (stores orders, inventory records, and shop settings).
* **Invoice Storage**: Google Cloud Storage bucket `dkeramik-fullstack-invoices`.

### Secrets & Environment Variables
* GitHub Actions secret `ADMIN_PASSWORD`: Password for `/admin/login` (applied on each API deploy).
* GCP Secret Manager `SESSION_SECRET`: Cookie session signing secret.
* GCP Secret Manager `WEBHOOK_SECRET`: Shared secret for internal webhooks.
* `PAYSERA_PROJECT_ID` & `PAYSERA_PASSWORD`: Paysera payment gateway credentials (if omitted, Paysera links are disabled and store uses manual SEPA mode).
* GCP Secret Manager `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: SMTP credentials for invoice email. If `SMTP_HOST` is unset, the API logs invoices instead of sending mail.
* Paysera callback URL: `https://<api-domain>/api/webhooks/paysera`.

### Checking Cloud Run Logs
To monitor live requests, webhook deliveries, or errors:
```bash
gcloud run logs read --project=dkeramik-fullstack --region=europe-central2 --limit=50
```

### Local Development
```bash
cd backend
npm run dev # Starts local in-memory API server at http://localhost:8787
```
</details>
