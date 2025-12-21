"use client";

import { useState } from "react";
import { useCartStore, useCheckoutStore, selectSubtotal } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  CreditCard,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type PaymentMethodType = "bkash" | "nagad" | "aamarpay" | "cod";

export default function PaymentConfirmPage() {
  const { selectedPaymentMethod } = useCheckoutStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    (selectedPaymentMethod as PaymentMethodType) || "bkash"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const subtotal = useCartStore(selectSubtotal);
  const deliveryCharge = 50; // This should come from checkout state
  const total = subtotal + deliveryCharge;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethods: Array<{
    value: PaymentMethodType;
    label: string;
    icon: LucideIcon;
    color: string;
    instructions: string[];
  }> = [
    {
      value: "bkash",
      label: "bKash",
      icon: Wallet,
      color: "bg-purple-500",
      instructions: [
        "Go to your bKash mobile menu",
        "Select 'Send Money'",
        "Enter merchant bKash number: 01XXXXXXXXX",
        "Enter the amount: " + formatPrice(total),
        "Enter your bKash PIN",
        "Keep the transaction ID for confirmation",
      ],
    },
    {
      value: "nagad",
      label: "Nagad",
      icon: Smartphone,
      color: "bg-orange-500",
      instructions: [
        "Go to your Nagad mobile menu",
        "Select 'Send Money'",
        "Enter merchant Nagad number: 01XXXXXXXXX",
        "Enter the amount: " + formatPrice(total),
        "Enter your Nagad PIN",
        "Keep the transaction ID for confirmation",
      ],
    },
    {
      value: "aamarpay",
      label: "AamarPay",
      icon: CreditCard,
      color: "bg-blue-500",
      instructions: [
        "Click on 'Pay Now' button below",
        "You will be redirected to secure payment gateway",
        "Select your preferred payment method",
        "Complete the payment process",
        "You will be redirected back after payment",
      ],
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      icon: ArrowRight,
      color: "bg-green-500",
      instructions: [
        "No advance payment required",
        "Pay when you receive your order",
        "Keep exact amount ready for smooth delivery",
        "Check your order before accepting",
      ],
    },
  ];

  const selectedMethodDetails = paymentMethods.find(
    (m) => m.value === paymentMethod
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/checkout"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Link>
          <h1 className="text-3xl font-bold">Payment Confirmation</h1>
          <p className="text-muted-foreground mt-2">
            Complete your payment to confirm your order
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethodType)
                  }
                >
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.value}
                        className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <RadioGroupItem
                          value={method.value}
                          id={method.value}
                        />
                        <div className="flex items-center space-x-3 flex-1">
                          <div
                            className={`p-2 rounded ${method.color} bg-opacity-10`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <Label
                              htmlFor={method.value}
                              className="font-medium cursor-pointer"
                            >
                              {method.label}
                            </Label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            {selectedMethodDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedMethodDetails.label} Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedMethodDetails.instructions.map(
                      (instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{instruction}</span>
                        </div>
                      )
                    )}
                  </div>

                  {paymentMethod !== "cod" && paymentMethod !== "aamarpay" && (
                    <div className="mt-6 space-y-4">
                      <Separator />
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-phone">
                            Your Mobile Number
                          </Label>
                          <Input
                            id="payment-phone"
                            placeholder="Enter your mobile number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transaction-id">Transaction ID</Label>
                          <Input
                            id="transaction-id"
                            placeholder="Enter transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {paymentMethod === "aamarpay" ? (
                <Button size="lg" className="flex-1">
                  Pay Now with AamarPay
                </Button>
              ) : paymentMethod === "cod" ? (
                <Button size="lg" className="flex-1">
                  Confirm Order (COD)
                </Button>
              ) : (
                <Button size="lg" className="flex-1">
                  Confirm Payment
                </Button>
              )}
              <Link href="/checkout">
                <Button variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery Charge
                    </span>
                    <span>{formatPrice(deliveryCharge)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Payment Method: {selectedMethodDetails?.label}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
