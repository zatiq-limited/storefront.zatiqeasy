"use client";

import { useState } from "react";

export function PaymentOptionsSection() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cod" | "online">("cod");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const paymentMethods = [
    { id: "cod", name: "Cash on Delivery", description: "Pay when you receive your order" },
    { id: "online", name: "Online Payment", description: "Pay with credit/debit card or mobile banking" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Payment Method
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedPaymentMethod === method.id}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as "cod" | "online")}
              className="mr-3 text-blue-zatiq focus:ring-blue-zatiq"
            />
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {method.name}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {method.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {selectedPaymentMethod !== "cod" && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 mr-3 text-blue-zatiq focus:ring-blue-zatiq rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              I agree to the{" "}
              <a href="#" className="text-blue-zatiq hover:underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-zatiq hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
      )}
    </div>
  );
}