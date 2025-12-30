"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  BkashPayment,
  CodPayment,
  NagadPayment,
  SelfMfsPayment,
  AamarpayPayment,
} from "./gateways";

interface PaymentMethodSelectorProps {
  orderPayload: any; // Full order payload matching old project structure
  shopMfsDetails?: {
    bkash_number?: string;
    bkash_qr?: string;
    nagad_number?: string;
    nagad_qr?: string;
  };
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentRedirect?: (paymentUrl: string) => void;
  className?: string;
}

const paymentMethods = [
  {
    value: "bkash",
    label: "bKash",
    description: "Pay with bKash mobile wallet",
    icon: "👝",
    color: "purple",
  },
  {
    value: "nagad",
    label: "Nagad",
    description: "Pay with Nagad mobile wallet",
    icon: "📱",
    color: "orange",
  },
  {
    value: "aamarpay",
    label: "AamarPay",
    description: "Pay with credit/debit card or mobile banking",
    icon: "💳",
    color: "blue",
  },
  {
    value: "self_mfs",
    label: "Other Mobile Banking",
    description: "Rocket, UPay, TAP, OK, etc.",
    icon: "📲",
    color: "indigo",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: "🚚",
    color: "green",
  },
];

export function PaymentMethodSelector({
  orderPayload,
  shopMfsDetails,
  onPaymentSuccess,
  onPaymentError,
  onPaymentRedirect,
  className,
}: PaymentMethodSelectorProps) {
  const { selectedPaymentMethod, setSelectedPaymentMethod } = useCheckoutStore();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method as any);
    setShowPaymentForm(true);
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case "bkash":
        return (
          <BkashPayment
            orderPayload={{...orderPayload, payment_type: "bkash"}}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            onPaymentRedirect={onPaymentRedirect}
          />
        );
      case "nagad":
        return (
          <NagadPayment
            orderPayload={{...orderPayload, payment_type: "nagad"}}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            onPaymentRedirect={onPaymentRedirect}
          />
        );
      case "aamarpay":
        return (
          <AamarpayPayment
            orderPayload={{...orderPayload, payment_type: "aamarpay"}}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            onPaymentRedirect={onPaymentRedirect}
          />
        );
      case "self_mfs":
        return (
          <SelfMfsPayment
            orderPayload={orderPayload}
            shopMfsDetails={shopMfsDetails}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            onPaymentRedirect={onPaymentRedirect}
          />
        );
      case "cod":
        return (
          <CodPayment
            orderPayload={{...orderPayload, payment_type: "cod"}}
            onOrderSuccess={(receiptUrl) => onPaymentRedirect?.(`/payment-confirm?status=success&receipt_url=${receiptUrl}`)}
            onPaymentError={onPaymentError}
            onPaymentRedirect={onPaymentRedirect}
          />
        );
      default:
        return null;
    }
  };

  if (showPaymentForm && selectedPaymentMethod) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowPaymentForm(false)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to payment methods
        </button>
        {renderPaymentForm()}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={handleMethodSelect}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <div
              key={method.value}
              className={cn(
                "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                selectedPaymentMethod === method.value
                  ? `border-${method.color}-500 bg-${method.color}-50`
                  : "hover:bg-muted/50"
              )}
              onClick={() => handleMethodSelect(method.value)}
            >
              <RadioGroupItem value={method.value} id={method.value} />
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <Label
                    htmlFor={method.value}
                    className="font-medium cursor-pointer"
                  >
                    {method.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
          <p className="font-medium mb-1">Security Notice:</p>
          <p>• All payment transactions are encrypted and secure</p>
          <p>• We never store your payment information</p>
          <p>• For payment support, contact our customer service</p>
        </div>
      </CardContent>
    </Card>
  );
}