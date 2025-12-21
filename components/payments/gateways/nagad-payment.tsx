"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentType } from "@/lib/payments/types";
import { processPayment } from "@/lib/payments/api";
import { formatPrice, parsePaymentError } from "@/lib/payments/utils";

interface NagadPaymentProps {
  amount: number;
  receiptId: string;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentRedirect?: (paymentUrl: string) => void;
  className?: string;
}

export function NagadPayment({
  amount,
  receiptId,
  onPaymentSuccess,
  onPaymentError,
  onPaymentRedirect,
  className,
}: NagadPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // Process payment through API
      const paymentResponse = await processPayment({
        receipt_id: receiptId,
        pay_now_amount: amount,
        redirect_root_url: window.location.origin + '/payment-confirm',
      });

      if (paymentResponse.success && paymentResponse.data?.payment_url) {
        // Redirect to Nagad payment page
        if (onPaymentRedirect) {
          onPaymentRedirect(paymentResponse.data.payment_url);
        } else {
          window.location.href = paymentResponse.data.payment_url;
        }
      } else {
        throw new Error(paymentResponse.error || 'Failed to initiate payment');
      }
    } catch (err: any) {
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
          <Smartphone className="h-5 w-5 text-orange-600" />
          Pay with Nagad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2">Payment Details</h4>
          <div className="text-2xl font-bold text-orange-900">
            {formatPrice(amount)}
          </div>
          <p className="text-sm text-orange-700 mt-1">
            Merchant: Zatiq Store
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">How to pay:</h4>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. Click "Pay with Nagad" button</li>
            <li>2. You will be redirected to Nagad payment page</li>
            <li>3. Enter your Nagad number and PIN</li>
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
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isProcessing}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? "Processing..." : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Pay with Nagad
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Your payment information is secure and encrypted</p>
          <p>• You will receive a confirmation SMS from Nagad</p>
          <p>• For support, dial 16167 (Nagad helpline)</p>
        </div>
      </CardContent>
    </Card>
  );
}