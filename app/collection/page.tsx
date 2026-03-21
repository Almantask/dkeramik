'use client';

import { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { products, categories } from '@/content/products';

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-clay-700 mb-4">
            Collection
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-2xl mx-auto">
            Each piece is handcrafted with intention. Designed for daily use, built to last,
            made to bring warmth to your home.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-sm text-sm font-nunito transition-colors ${
                selectedCategory === category
                  ? 'bg-clay-500 text-clay-50'
                  : 'bg-clay-100 text-clay-600 hover:bg-clay-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
