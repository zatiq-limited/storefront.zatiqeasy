'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchPageClientProps {
  query: string;
  products: any[];
}

export function SearchPageClient({ query, products }: SearchPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Products</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="mb-4 text-gray-600">
          {products.length} results for "{query}"
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {query && products.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No products found for "{query}"
        </p>
      )}
    </div>
  );
}
