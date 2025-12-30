"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { PaymentType } from "@/lib/payments/types";
import { paymentService } from "@/lib/api";
import type { CreateOrderPayload } from "@/lib/api/types";
import { formatPrice, parsePaymentError } from "@/lib/payments/utils";

interface AamarpayPaymentProps {
  orderPayload: CreateOrderPayload;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentRedirect?: (paymentUrl: string) => void;
  className?: string;
}

export function AamarpayPayment({
  orderPayload,
  onPaymentError,
  onPaymentRedirect,
  className,
}: AamarpayPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess] = useState(false);

  const amount = orderPayload?.pay_now_amount || 0;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // Create order with AamarPay payment (matching old project pattern)
      const orderResponse = await paymentService.createOrder({
        ...orderPayload,
        payment_type: PaymentType.AAMARPAY,
      });

      if (orderResponse.success && orderResponse.data?.payment_url) {
        // Show redirecting state
        setIsRedirecting(true);

        // Delay for UX to show redirecting animation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Redirect to AamarPay payment page
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

  if (isRedirecting) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">
                Redirecting to Payment Gateway...
              </h3>
              <p className="text-muted-foreground">
                You will be redirected to AamarPay&apos;s secure payment page.
              </p>
              <p className="text-sm text-muted-foreground">
                Please do not close this window.
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
          <CreditCard className="h-5 w-5 text-blue-600" />
          Pay with AamarPay
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Payment Details</h4>
          <div className="text-2xl font-bold text-blue-900">
            {formatPrice(amount)}
          </div>
          <p className="text-sm text-blue-700 mt-1">Merchant: Zatiq Store</p>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-sm">Accepted Payment Methods</h5>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center p-2 border rounded">
              <CreditCard className="h-6 w-6 mx-auto mb-1" />
              <div>Debit/Credit Card</div>
            </div>
            <div className="text-center p-2 border rounded">
              <div className="h-6 w-6 mx-auto mb-1 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">
                bK
              </div>
              <div>bKash</div>
            </div>
            <div className="text-center p-2 border rounded">
              <div className="h-6 w-6 mx-auto mb-1 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">
                DB
              </div>
              <div>Dutch-Bangla</div>
            </div>
            <div className="text-center p-2 border rounded">
              <div className="h-6 w-6 mx-auto mb-1 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xs">
                N
              </div>
              <div>Nagad</div>
            </div>
            <div className="text-center p-2 border rounded">
              <div className="h-6 w-6 mx-auto mb-1 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                R
              </div>
              <div>Rocket</div>
            </div>
            <div className="text-center p-2 border rounded">
              <CreditCard className="h-6 w-6 mx-auto mb-1" />
              <div>Net Banking</div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isProcessing || isRedirecting}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              Pay with AamarPay
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            • You will be redirected to AamarPay&apos;s secure payment gateway
          </p>
          <p>• All major debit/credit cards and mobile banking are accepted</p>
          <p>• Your payment information is processed securely</p>
          <p>• Transaction is completed in real-time</p>
        </div>
      </CardContent>
    </Card>
  );
}
