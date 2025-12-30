"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { PaymentType } from "@/lib/payments/types";
import { paymentService } from "@/lib/api";
import { parsePaymentError, formatPrice } from "@/lib/payments/utils";

interface SelfMfsPaymentProps {
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

const mfsProviders = [
  { value: "bkash", label: "bKash", color: "purple" },
  { value: "nagad", label: "Nagad", color: "orange" },
  { value: "rocket", label: "Rocket (Dutch-Bangla)", color: "red" },
  { value: "upay", label: "UPay", color: "blue" },
  { value: "tap", label: "TAP", color: "green" },
  { value: "ok", label: "OK", color: "orange" },
  { value: "mcb", label: "Mobile Cash (IBBL)", color: "purple" },
];

export function SelfMfsPayment({
  orderPayload,
  shopMfsDetails,
  onPaymentSuccess,
  onPaymentError,
  onPaymentRedirect,
  className,
}: SelfMfsPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const amount = orderPayload?.pay_now_amount || 0;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProvider) {
      setError("Please select a mobile banking provider");
      return;
    }

    if (phoneNumber.length < 11) {
      setError("Please enter a valid mobile number");
      return;
    }

    if (!transactionId) {
      setError("Please enter the transaction ID");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Create order with Self MFS payment (matching old project pattern)
      const orderResponse = await paymentService.createOrder({
        ...orderPayload,
        payment_type: PaymentType.SELF_MFS,
        mfs_payment_phone: phoneNumber,
        mfs_transaction_id: transactionId,
        mfs_provider: selectedProvider,
      });

      if (orderResponse.success && orderResponse.data?.receipt_url) {
        setIsSuccess(true);
        const redirectUrl = `${window.location.origin}/payment-confirm?status=success&receipt_url=${orderResponse.data.receipt_url}`;

        if (onPaymentRedirect) {
          onPaymentRedirect(redirectUrl);
        } else if (onPaymentSuccess) {
          onPaymentSuccess(transactionId);
        }
      } else {
        throw new Error(orderResponse.error || "Failed to create order");
      }
    } catch (err: any) {
      const errorMessage = parsePaymentError(err);
      setError(errorMessage);
      onPaymentError?.(new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedProviderInfo = mfsProviders.find(
    (p) => p.value === selectedProvider
  );

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
                Your payment of {formatPrice(amount)} has been processed
                successfully.
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
          <Smartphone className="h-5 w-5 text-indigo-600" />
          Mobile Banking Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">
              Payment Details
            </h4>
            <div className="text-2xl font-bold text-indigo-900">
              {formatPrice(amount)}
            </div>
            <p className="text-sm text-indigo-700 mt-1">
              Merchant: Zatiq Store
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mfs-provider">Select Provider</Label>
            <Select
              value={selectedProvider}
              onValueChange={(value: string | null) =>
                value && setSelectedProvider(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your mobile banking service" />
              </SelectTrigger>
              <SelectContent>
                {mfsProviders.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProviderInfo && (
            <div className="space-y-2">
              <Label htmlFor="mfs-number">Your Account Number</Label>
              <Input
                id="mfs-number"
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
                Enter your {selectedProviderInfo.label} mobile number
              </p>

              {/* Show shop's MFS details if available */}
              {shopMfsDetails && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Send payment to:</p>
                  {selectedProvider === "bkash" &&
                    shopMfsDetails.bkash_number && (
                      <div className="text-sm">
                        <span className="font-medium">bKash Number:</span>{" "}
                        {shopMfsDetails.bkash_number}
                      </div>
                    )}
                  {selectedProvider === "nagad" &&
                    shopMfsDetails.nagad_number && (
                      <div className="text-sm">
                        <span className="font-medium">Nagad Number:</span>{" "}
                        {shopMfsDetails.nagad_number}
                      </div>
                    )}
                  {shopMfsDetails.bkash_qr && selectedProvider === "bkash" && (
                    <div className="mt-2">
                      <img
                        src={shopMfsDetails.bkash_qr}
                        alt="bKash QR"
                        className="w-32 h-32"
                      />
                    </div>
                  )}
                  {shopMfsDetails.nagad_qr && selectedProvider === "nagad" && (
                    <div className="mt-2">
                      <img
                        src={shopMfsDetails.nagad_qr}
                        alt="Nagad QR"
                        className="w-32 h-32"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="font-medium text-sm mb-2">Payment Instructions</h5>
              <ol className="text-xs space-y-1 list-decimal list-inside">
                <li>Go to your {selectedProviderInfo?.label} mobile menu</li>
                <li>Select "Send Money" or "Payment" option</li>
                <li>Enter the merchant number shown above</li>
                <li>Enter amount: {formatPrice(amount)}</li>
                <li>Enter your PIN to confirm</li>
                <li>Save the transaction ID for verification</li>
              </ol>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-id">Transaction ID *</Label>
            <Input
              id="transaction-id"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the transaction ID from your mobile banking app
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isProcessing || !selectedProvider}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Processing..." : "Verify Payment"}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Make sure to send the exact amount</p>
            <p>• Double-check the merchant number before sending</p>
            <p>• Keep your transaction receipt for verification</p>
            <p>
              • For support, contact your respective mobile banking provider
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
