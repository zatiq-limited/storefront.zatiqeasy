"use client";

import { useCheckoutStore } from "@/stores";
import { CreditCard, Smartphone, Truck, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PaymentOptionsSectionProps {
  className?: string;
}

const paymentMethods = [
  {
    value: "cod" as const,
    label: "Cash on Delivery (COD)",
    description: "Pay when you receive your order",
    icon: Truck,
    fee: 0,
  },
  {
    value: "bkash" as const,
    label: "bKash",
    description: "Pay with bKash mobile wallet",
    icon: Wallet,
    fee: 0,
  },
  {
    value: "aamarpay" as const,
    label: "AamarPay",
    description: "Pay with credit/debit card or mobile banking",
    icon: CreditCard,
    fee: 0,
  },
  {
    value: "partial_payment" as const,
    label: "Partial Payment",
    description: "Pay part now, rest on delivery",
    icon: DollarSign,
    fee: 0,
  },
  {
    value: "self_mfs" as const,
    label: "Self Mobile Banking",
    description: "Pay with other mobile banking services",
    icon: Smartphone,
    fee: 0,
  },
];

export function PaymentOptionsSection({ className }: PaymentOptionsSectionProps) {
  const { selectedPaymentMethod, setSelectedPaymentMethod } = useCheckoutStore();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={(value: string) => setSelectedPaymentMethod(value as any)}
          className="space-y-3"
        >
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.value}
                className={cn(
                  "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                  selectedPaymentMethod === method.value
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                )}
                onClick={() => setSelectedPaymentMethod(method.value)}
              >
                <RadioGroupItem value={method.value} id={method.value} />
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className="h-5 w-5 text-muted-foreground" />
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
                  {method.fee > 0 && (
                    <span className="text-sm text-muted-foreground">
                      +{method.fee} BDT fee
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {selectedPaymentMethod === "partial_payment" && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Partial Payment Details</h4>
            <p className="text-sm text-muted-foreground mb-2">
              You can pay a portion now and the rest when you receive your order.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Minimum advance:</span>
                <span className="font-medium">৳100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Maximum advance:</span>
                <span className="font-medium">50% of order value</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}