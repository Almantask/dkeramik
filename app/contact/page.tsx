'use client';

import { useState } from 'react';
import CeramicBackground from '@/components/ui/CeramicBackground';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';

export default function ContactPage() {
  const { t } = useLanguage();
  const c = t.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = encodeURIComponent(`DKeramik: ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:donata.vengalyte@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="relative bg-clay-50 min-h-screen">
      <CeramicBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Heading */}
        <h1 className="font-playfair text-3xl sm:text-4xl text-clay-700 mb-4">
          {c.headline}
        </h1>
        <p className="text-clay-600 leading-relaxed mb-12">
          {c.subheadline}
        </p>

        {submitted && (
          <div className="mb-8 p-4 bg-clay-100 border border-clay-200 text-clay-700 text-sm rounded-sm">
            {c.successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="block font-nunito text-sm font-semibold text-clay-700 mb-2"
            >
              {c.nameLabel}
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={c.namePlaceholder}
              className="w-full px-4 py-3 bg-white border border-clay-200 text-clay-700 placeholder-clay-400 font-nunito text-sm focus:outline-none focus:border-clay-500 transition-colors rounded-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="block font-nunito text-sm font-semibold text-clay-700 mb-2"
            >
              {c.emailLabel}
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.emailPlaceholder}
              className="w-full px-4 py-3 bg-white border border-clay-200 text-clay-700 placeholder-clay-400 font-nunito text-sm focus:outline-none focus:border-clay-500 transition-colors rounded-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="block font-nunito text-sm font-semibold text-clay-700 mb-2"
            >
              {c.messageLabel}
            </label>
            <textarea
              id="contact-message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={c.messagePlaceholder}
              className="w-full px-4 py-3 bg-white border border-clay-200 text-clay-700 placeholder-clay-400 font-nunito text-sm focus:outline-none focus:border-clay-500 transition-colors rounded-sm resize-vertical"
            />
          </div>

          <Button type="submit">{c.sendButton}</Button>
        </form>
      </div>
    </div>
  );
}
