'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';

export default function CustomPage() {
  const { t } = useLanguage();
  const c = t.customOrders;

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
        {/* Header */}
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 mb-3">
          {c.headline}
        </h1>
        <p className="font-playfair italic text-clay-400 text-lg mb-12">{c.subheadline}</p>

        {/* Intro */}
        <div className="space-y-5 text-clay-600 leading-loose mb-12">
          <p>{c.intro1}</p>
          <p>
            {c.intro2Part1}
            <strong className="font-semibold text-clay-700">{c.intro2Bold}</strong>
            {c.intro2Part2}
          </p>
        </div>

        {/* What can be customised */}
        <div className="mb-10">
          <h2 className="font-playfair text-2xl text-clay-600 mb-4">{c.whatHeading}</h2>
          <ul className="space-y-2">
            {c.whatItems.map((item) => (
              <li key={item} className="text-clay-600 flex items-start gap-2">
                <span className="text-clay-400 mt-1" aria-hidden="true">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Process */}
        <div className="mb-12">
          <h2 className="font-playfair text-2xl text-clay-600 mb-4">{c.processHeading}</h2>
          <ol className="space-y-3">
            {c.processSteps.map((step, idx) => (
              <li key={idx} className="text-clay-600 flex items-start gap-3">
                <span className="font-playfair text-clay-300 text-lg leading-tight mt-0.5">
                  {idx + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="bg-clay-100 border border-clay-200 p-8 text-center">
            <h3 className="font-playfair text-2xl text-clay-700 mb-3">{c.formSuccessTitle}</h3>
            <p className="text-clay-600 leading-loose">{c.formSuccessBody}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-clay-700 text-sm font-semibold mb-2"
              >
                {c.formNameLabel}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={c.formNamePlaceholder}
                className="w-full border border-clay-200 bg-white px-4 py-3 text-clay-700 placeholder-clay-300 focus:outline-none focus:border-clay-400 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-clay-700 text-sm font-semibold mb-2"
              >
                {c.formEmailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={c.formEmailPlaceholder}
                className="w-full border border-clay-200 bg-white px-4 py-3 text-clay-700 placeholder-clay-300 focus:outline-none focus:border-clay-400 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-clay-700 text-sm font-semibold mb-2"
              >
                {c.formMessageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder={c.formMessagePlaceholder}
                className="w-full border border-clay-200 bg-white px-4 py-3 text-clay-700 placeholder-clay-300 focus:outline-none focus:border-clay-400 transition-colors resize-none"
              />
            </div>
            <Button type="submit">{c.formSubmit}</Button>
          </form>
        )}

        {/* Closing */}
        <p className="mt-12 font-playfair italic text-clay-500 text-center">
          {c.closing}
        </p>
      </div>
    </div>
  );
}
