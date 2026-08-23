import PDFDocument from 'pdfkit';
import { centsToEur, type OrderRecord, type ShopSettings } from './domain.js';

function money(cents: number): string {
  return `${centsToEur(cents).toFixed(2)} EUR`;
}

export function buildInvoicePdf(order: OrderRecord, settings: ShopSettings): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, compress: false });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk as Buffer));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const lang = order.language;
    doc.fontSize(18).text(lang === 'lt' ? 'Saskaita faktura / Invoice' : 'Invoice / Saskaita faktura');
    doc.moveDown(0.5);
    doc.fontSize(11).text(order.invoiceNumber);
    doc.text(order.createdAt.slice(0, 10));
    doc.moveDown();
    doc.text(`Seller: ${settings.sellerName}`);
    doc.text(settings.sellerAddress);
    doc.text(`IBAN: ${settings.iban}`);
    doc.text('PVM netaikomas / VAT not applied');
    doc.moveDown();
    doc.text(`Buyer: ${order.buyer.name}`);
    doc.text(order.buyer.email);
    if (order.buyer.address) doc.text(order.buyer.address);
    doc.moveDown();
    doc.text(lang === 'lt' ? 'Eilutes:' : 'Lines:');
    for (const line of order.items) {
      const name = lang === 'lt' ? line.nameLt : line.nameEn;
      doc.text(`${line.qty} x ${name} (${line.sku}) — ${money(line.lineCents)}`);
    }
    if (order.shippingCents > 0) {
      doc.text(`Shipping LT — ${money(order.shippingCents)}`);
    }
    doc.moveDown();
    doc.fontSize(13).text(`Total: ${money(order.amountCents)}`);
    doc.moveDown();
    doc.fontSize(11).text(`Payment purpose / mokejimo paskirtis: ${order.invoiceNumber}`);
    doc.text('Apmoketi pavedimu / Pay by bank transfer.');
    doc.end();
  });
}
