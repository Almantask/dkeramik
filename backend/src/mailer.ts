import nodemailer from 'nodemailer';
import { centsToEur, type OrderRecord } from './domain.js';

export interface Mailer {
  sendOrderEmails(
    order: OrderRecord,
    pdf: Buffer,
    payUrl: string | null,
    notifyEmail: string,
  ): Promise<void>;
  sendPaidEmails(order: OrderRecord, notifyEmail: string): Promise<void>;
}

export function createMailer(): Mailer {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return {
      async sendOrderEmails(order) {
        console.log(
          `[mail] invoice ${order.invoiceNumber} to ${order.buyer.email} (${centsToEur(order.amountCents)} EUR)`,
        );
      },
      async sendPaidEmails(order) {
        console.log(`[mail] paid ${order.invoiceNumber} to ${order.buyer.email}`);
      },
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  const from = process.env.SMTP_FROM ?? 'DKeramik <info@dkeramik.lt>';

  return {
    async sendOrderEmails(order, pdf, payUrl, notifyEmail) {
      const subject = `DKeramik ${order.invoiceNumber}`;
      const payLine = payUrl ? `\nPay: ${payUrl}` : '';
      const text = `Invoice ${order.invoiceNumber}\nTotal: ${centsToEur(order.amountCents).toFixed(2)} EUR\nPurpose: ${order.invoiceNumber}${payLine}`;
      await transporter.sendMail({
        from,
        to: order.buyer.email,
        subject,
        text,
        attachments: [{ filename: `${order.invoiceNumber}.pdf`, content: pdf }],
      });
      await transporter.sendMail({
        from,
        to: notifyEmail,
        subject: `[new order] ${subject}`,
        text,
        attachments: [{ filename: `${order.invoiceNumber}.pdf`, content: pdf }],
      });
    },
    async sendPaidEmails(order, notifyEmail) {
      const text = `Payment received for ${order.invoiceNumber} (${centsToEur(order.amountCents).toFixed(2)} EUR).`;
      await transporter.sendMail({
        from,
        to: order.buyer.email,
        subject: `Paid ${order.invoiceNumber}`,
        text,
      });
      await transporter.sendMail({
        from,
        to: notifyEmail,
        subject: `[paid] ${order.invoiceNumber}`,
        text,
      });
    },
  };
}
