"use client";

import { useState } from "react";

export function DeliveryZoneSection() {
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState("Inside City");

  const deliveryZones = [
    { name: "Inside City", charge: 50 },
    { name: "Suburb", charge: 80 },
    { name: "Outside City", charge: 120 },
    { name: "Others", charge: 150 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Delivery Zone
      </h2>

      <div className="space-y-2">
        {deliveryZones.map((zone) => (
          <label
            key={zone.name}
            className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <input
              type="radio"
              name="deliveryZone"
              value={zone.name}
              checked={selectedDeliveryZone === zone.name}
              onChange={(e) => setSelectedDeliveryZone(e.target.value)}
              className="mr-3 text-blue-zatiq focus:ring-blue-zatiq"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {zone.name}
              </span>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              ৳{zone.charge}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}