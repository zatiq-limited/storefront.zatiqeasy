"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BkashPaymentProps {
  amount: number;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: Error) => void;
  className?: string;
}

export function BkashPayment({
  amount,
  onPaymentSuccess,
  onPaymentError,
  className,
}: BkashPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length < 11) {
      setError("Please enter a valid bKash number");
      return;
    }

    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Simulate bKash API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock successful payment
      const mockTransactionId = "BK" + Date.now();
      setIsSuccess(true);
      onPaymentSuccess?.(mockTransactionId);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">
                Payment Successful!
              </h3>
              <p className="text-muted-foreground">
                Your payment of {formatPrice(amount)} has been processed successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-purple-600" />
          Pay with bKash
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Payment Details</h4>
            <div className="text-2xl font-bold text-purple-900">
              {formatPrice(amount)}
            </div>
            <p className="text-sm text-purple-700 mt-1">
              Merchant: Zatiq Store
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bkash-number">bKash Account Number</Label>
            <Input
              id="bkash-number"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 11) {
                  setPhoneNumber(value);
                }
              }}
              maxLength={11}
            />
            <p className="text-xs text-muted-foreground">
              Enter your registered bKash mobile number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bkash-pin">bKash PIN</Label>
            <Input
              id="bkash-pin"
              type="password"
              placeholder="****"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 4) {
                  setPin(value);
                }
              }}
              maxLength={4}
            />
            <p className="text-xs text-muted-foreground">
              Enter your 4-digit bKash security PIN
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Processing..." : `Pay ${formatPrice(amount)}`}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Your payment information is secure and encrypted</p>
            <p>• You will receive a confirmation SMS from bKash</p>
            <p>• For support, dial 16247 (bKash helpline)</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}