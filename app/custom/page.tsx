'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function CustomPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-clay-700 mb-4">
            Custom Orders
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-2xl mx-auto">
            Let's create something meaningful for your home.
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12 space-y-4 text-clay-600 leading-relaxed">
          <p>
            Every home is different. Every person has their own rituals, their own aesthetic,
            their own vision of beauty. Sometimes, what you need doesn't exist yet—until we
            make it together.
          </p>
          <p>
            <strong className="text-clay-700">Custom pieces are available</strong> for those
            seeking something specific. Whether it's a set of dinner bowls in a particular size,
            a vase to fit a specific space, or mugs with a custom glaze combination, I'm here
            to collaborate.
          </p>
        </div>

        {/* What Can Be Customized */}
        <div className="mb-12">
          <h2 className="font-playfair text-2xl text-clay-700 mb-6">
            What Can Be Customized
          </h2>
          <ul className="space-y-3 text-clay-600">
            <li className="flex items-start">
              <span className="text-clay-400 mr-3">•</span>
              <span><strong className="text-clay-700">Size & shape</strong> – Specific dimensions or proportions</span>
            </li>
            <li className="flex items-start">
              <span className="text-clay-400 mr-3">•</span>
              <span><strong className="text-clay-700">Glaze colors</strong> – From our palette or custom blends</span>
            </li>
            <li className="flex items-start">
              <span className="text-clay-400 mr-3">•</span>
              <span><strong className="text-clay-700">Sets & collections</strong> – Coordinated pieces for your table</span>
            </li>
            <li className="flex items-start">
              <span className="text-clay-400 mr-3">•</span>
              <span><strong className="text-clay-700">Quantity</strong> – Single pieces or larger sets</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-clay-200 rounded-sm p-8">
            <div>
              <label htmlFor="name" className="block text-clay-700 font-semibold mb-2 text-sm">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-clay-200 rounded-sm focus:outline-none focus:border-clay-400 text-clay-700"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-clay-700 font-semibold mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-clay-200 rounded-sm focus:outline-none focus:border-clay-400 text-clay-700"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-clay-700 font-semibold mb-2 text-sm">
                Tell Me About Your Vision
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="What are you looking for? What purpose will it serve? Any specific dimensions or glaze preferences?"
                className="w-full px-4 py-3 border border-clay-200 rounded-sm focus:outline-none focus:border-clay-400 text-clay-700"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Inquiry
            </Button>
          </form>
        ) : (
          <div className="bg-clay-100 border border-clay-200 rounded-sm p-8 text-center">
            <h3 className="font-playfair text-2xl text-clay-700 mb-4">
              Thank You!
            </h3>
            <p className="text-clay-600 leading-relaxed">
              Your inquiry has been received. I'll be in touch soon to discuss your custom piece.
              I'm excited to create something special for your home.
            </p>
          </div>
        )}

        {/* Closing Note */}
        <div className="mt-12 pt-12 border-t border-clay-200 text-center">
          <p className="font-playfair text-lg text-clay-600 italic leading-relaxed">
            Custom pieces typically take 4-6 weeks from design approval to completion.
            Let's make something beautiful together.
          </p>
        </div>
      </div>
    </div>
  );
}
