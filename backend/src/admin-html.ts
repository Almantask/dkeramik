import { PRODUCT_NAMES } from './catalog.js';
import { centsToEur, type InventoryRecord, type OrderRecord, type ShopSettings } from './domain.js';
import { publicPageUrl } from './site-url.js';

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const css = `
  body{font-family:Nunito,system-ui,sans-serif;background:#fdf8f5;color:#6b4c30;margin:0}
  main{max-width:1100px;margin:0 auto;padding:2rem}
  a,button{font:inherit}
  table{width:100%;border-collapse:collapse;background:#fff}
  th,td{border-bottom:1px solid #e8d5c0;padding:.6rem;text-align:left;font-size:.9rem;vertical-align:top}
  .btn{display:inline-block;background:#a67c52;color:#fdf8f5;border:0;padding:.45rem .8rem;cursor:pointer;white-space:nowrap;line-height:1.2}
  .table-wrap{overflow-x:auto}
  .actions,.row-form{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
  .actions{min-width:13rem}
  .actions form,.row-form{margin:0}
  input{padding:.4rem;border:1px solid #d4b896;background:#fff}
  nav{display:flex;flex-wrap:wrap;gap:.75rem 1rem;align-items:center}
  nav a{color:#8b6340}
  a.item-link{color:#8b6340;text-decoration:underline}
  a.item-link:hover{color:#a67c52}
`;

export function loginPage(error?: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Admin login</title><style>${css}</style></head>
  <body><main>
    <h1>DKeramik admin</h1>
    ${error ? `<p>${esc(error)}</p>` : ''}
    <form method="post" action="/admin/login">
      <label>Password<br><input type="password" name="password" required></label>
      <p><button class="btn" type="submit">Sign in</button></p>
    </form>
  </main></body></html>`;
}

function shell(title: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head>
  <body><main>
    <nav>
      <a href="/admin/orders">Orders</a>
      <a href="/admin/inventory">Inventory</a>
      <a href="/admin/settings">Settings</a>
      <form method="post" action="/admin/logout" style="display:inline"><button class="btn" type="submit">Log out</button></form>
    </nav>
    <h1>${esc(title)}</h1>
    ${body}
  </main></body></html>`;
}

export function ordersPage(orders: OrderRecord[], frontendOrigin = ''): string {
  const rows = orders
    .map(
      (o) => {
        const itemsHtml = o.items
          .map((item) => {
            const href = publicPageUrl(
              frontendOrigin,
              `/portfolio/${encodeURIComponent(item.productId)}`,
            );
            const itemName = item.nameLt || item.nameEn || item.productId;
            return `<div><a class="item-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="Open product in new tab">${esc(itemName)} (${esc(item.productId)})</a> <small>×${item.qty}</small></div>`;
          })
          .join('');
        return `<tr>
          <td>${esc(o.invoiceNumber)}</td>
          <td>${esc(o.status)}${o.underpaid ? ' (underpaid)' : ''}${o.overpaid ? ' (overpaid)' : ''}</td>
          <td>${itemsHtml || '—'}</td>
          <td>${esc(o.buyer.email)}</td>
          <td>${centsToEur(o.amountCents).toFixed(2)} EUR</td>
          <td>${esc(o.paidVia ?? '—')}</td>
          <td>
            <div class="actions">
            ${
              o.status === 'awaiting_payment'
                ? `<form method="post" action="/admin/orders/${esc(o.id)}/paid"><button class="btn">Mark paid</button></form>
            <form method="post" action="/admin/orders/${esc(o.id)}/cancel"><button class="btn">Cancel</button></form>`
                : ''
            }
            <form method="post" action="/admin/orders/${esc(o.id)}/resend"><button class="btn">Resend</button></form>
            <a href="/admin/orders/${esc(o.id)}/invoice.pdf">PDF</a>
            </div>
          </td>
        </tr>`;
      },
    )
    .join('');
  return shell(
    'Orders',
    `<div class="table-wrap"><table><thead><tr><th>Invoice</th><th>Status</th><th>Items</th><th>Buyer</th><th>Total</th><th>Paid via</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`,
  );
}

export function inventoryPage(items: InventoryRecord[], frontendOrigin = ''): string {
  const rows = items
    .map(
      (i) => {
        const names = PRODUCT_NAMES[i.productId];
        const displayName = names ? `${names.lt} / ${names.en}` : i.productId;
        const path = i.forSale ? `/shop/${encodeURIComponent(i.productId)}` : `/portfolio/${encodeURIComponent(i.productId)}`;
        const href = publicPageUrl(frontendOrigin, path);
        return `<tr>
          <td>
            <a class="item-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="Open product page in new tab">
              <strong>${esc(displayName)}</strong>
              <br><small style="color:#a67c52">${esc(i.productId)} ↗</small>
            </a>
          </td>
          <td>${esc(i.sku)}</td>
          <td>
            <form class="row-form" method="post" action="/admin/inventory/${esc(i.productId)}">
              <input name="priceCents" type="number" value="${i.priceCents}" title="Price in cents">
              <input name="stock" type="number" value="${i.stock}" title="Stock quantity">
              <label><input type="checkbox" name="forSale" ${i.forSale ? 'checked' : ''}> for sale</label>
              <button class="btn" type="submit">Save</button>
            </form>
          </td>
        </tr>`;
      },
    )
    .join('');
  return shell(
    'Inventory',
    `<div class="table-wrap"><table><thead><tr><th>Product</th><th>SKU</th><th>Edit</th></tr></thead><tbody>${rows}</tbody></table></div>`,
  );
}

export function settingsPage(settings: ShopSettings): string {
  return shell(
    'Settings',
    `<form method="post" action="/admin/settings">
      <p><label>IBAN<br><input name="iban" value="${esc(settings.iban)}" size="40"></label></p>
      <p><label>Seller name<br><input name="sellerName" value="${esc(settings.sellerName)}" size="40"></label></p>
      <p><label>Seller address<br><input name="sellerAddress" value="${esc(settings.sellerAddress)}" size="40"></label></p>
      <p><label>Pickup address<br><input name="pickupAddress" value="${esc(settings.pickupAddress)}" size="40"></label></p>
      <p><label>LT shipping cents<br><input name="shippingLtCents" type="number" value="${settings.shippingLtCents}"></label></p>
      <p><button class="btn" type="submit">Save</button></p>
    </form>`,
  );
}

export function mockPayPage(order: OrderRecord): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Mock pay</title><style>${css}</style></head>
  <body><main>
    <h1>Mock Paysera</h1>
    <p>${esc(order.invoiceNumber)} — ${centsToEur(order.amountCents).toFixed(2)} EUR</p>
    <form method="post" action="/mock-pay/${esc(order.id)}">
      <button class="btn" type="submit">Pay now</button>
    </form>
  </main></body></html>`;
}
