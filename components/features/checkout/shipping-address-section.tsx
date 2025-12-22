"use client";

import { useState } from "react";

export function ShippingAddressSection() {
  const [address, setAddress] = useState("");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Shipping Address
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address *
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-zatiq focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter your full address"
          />
        </div>
      </div>
    </div>
  );
}