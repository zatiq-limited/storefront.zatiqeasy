"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { PaymentType } from "@/lib/payments/types";
import { paymentService } from "@/lib/api";
import type { CreateOrderPayload } from "@/lib/api/types";
import { parsePaymentError, formatPrice } from "@/lib/payments/utils";

interface BkashPaymentProps {
  orderPayload: CreateOrderPayload;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentRedirect?: (paymentUrl: string) => void;
  className?: string;
}

export function BkashPayment({
  orderPayload,
  onPaymentError,
  onPaymentRedirect,
  className,
}: BkashPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess] = useState(false);
  const [error, setError] = useState("");

  const amount = orderPayload?.pay_now_amount || 0;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // Create order with bKash payment (matching old project pattern)
      const orderResponse = await paymentService.createOrder({
        ...orderPayload,
        payment_type: PaymentType.BKASH,
      });

      if (orderResponse.success && orderResponse.data?.payment_url) {
        // Redirect to bKash payment page
        if (onPaymentRedirect) {
          onPaymentRedirect(orderResponse.data.payment_url);
        } else {
          window.location.replace(orderResponse.data.payment_url);
        }
      } else if (orderResponse.success && orderResponse.data?.receipt_url) {
        // For non-gateway payments or successful orders without payment URL
        const redirectUrl = `${window.location.origin}/payment-confirm?status=success&receipt_url=${orderResponse.data.receipt_url}`;
        if (onPaymentRedirect) {
          onPaymentRedirect(redirectUrl);
        } else {
          window.location.replace(redirectUrl);
        }
      } else {
        throw new Error(orderResponse.error || "Failed to create order");
      }
    } catch (err) {
      const errorMessage = parsePaymentError(err);
      setError(errorMessage);
      onPaymentError?.(new Error(errorMessage));
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
          <Smartphone className="h-5 w-5 text-purple-600" />
          Pay with bKash
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Payment Details</h4>
          <div className="text-2xl font-bold text-purple-900">
            {formatPrice(amount)}
          </div>
          <p className="text-sm text-purple-700 mt-1">Merchant: Zatiq Store</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">How to pay:</h4>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. Click &quot;Pay with bKash&quot; button</li>
            <li>2. You will be redirected to bKash payment page</li>
            <li>3. Enter your bKash number and PIN</li>
            <li>4. Complete payment</li>
            <li>5. You will be returned to store after payment</li>
          </ol>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isProcessing}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Pay with bKash
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Your payment information is secure and encrypted</p>
          <p>• You will receive a confirmation SMS from bKash</p>
          <p>• For support, dial 16247 (bKash helpline)</p>
        </div>
      </CardContent>
    </Card>
  );
}
