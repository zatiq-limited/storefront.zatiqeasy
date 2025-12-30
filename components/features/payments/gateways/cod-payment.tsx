"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, CheckCircle, MapPin, Clock } from "lucide-react";
import { PaymentType } from "@/lib/payments/types";
import { paymentService } from "@/lib/api";
import type { CreateOrderPayload } from "@/lib/api/types";
import { parsePaymentError } from "@/lib/payments/utils";

interface CodPaymentProps {
  orderPayload: CreateOrderPayload;
  onOrderSuccess?: (receiptUrl: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentRedirect?: (paymentUrl: string) => void;
  className?: string;
}

export function CodPayment({
  orderPayload,
  onOrderSuccess,
  onPaymentError,
  onPaymentRedirect,
  className,
}: CodPaymentProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const amount = orderPayload?.pay_now_amount || 0;
  const customerInfo = orderPayload
    ? {
        name: orderPayload.customer_name,
        phone: orderPayload.customer_phone,
        address: orderPayload.customer_address,
      }
    : undefined;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleConfirmOrder = async () => {
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions to confirm your order");
      return;
    }

    setIsConfirming(true);
    setError("");

    try {
      // Create order with COD payment (matching old project pattern)
      const orderResponse = await paymentService.createOrder({
        ...orderPayload,
        payment_type: PaymentType.COD,
      });

      if (orderResponse.success && orderResponse.data?.receipt_url) {
        setIsSuccess(true);
        const redirectUrl = `${window.location.origin}/payment-confirm?status=success&receipt_url=${orderResponse.data.receipt_url}`;

        if (onPaymentRedirect) {
          onPaymentRedirect(redirectUrl);
        } else if (onOrderSuccess) {
          onOrderSuccess(orderResponse.data.receipt_url);
        }
      } else {
        throw new Error(orderResponse.error || "Failed to create order");
      }
    } catch (err) {
      const errorMessage = parsePaymentError(err);
      setError(errorMessage);
      onPaymentError?.(new Error(errorMessage));
    } finally {
      setIsConfirming(false);
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
                Order Confirmed!
              </h3>
              <p className="text-muted-foreground">
                Your order has been placed successfully. You will pay{" "}
                {formatPrice(amount)} when you receive your order.
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
          <Truck className="h-5 w-5 text-green-600" />
          Cash on Delivery (COD)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Order Summary</h4>
          <div className="text-2xl font-bold text-green-900">
            {formatPrice(amount)}
          </div>
          <p className="text-sm text-green-700 mt-1">
            Pay when you receive your order
          </p>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-sm">Delivery Information</h5>

          {customerInfo ? (
            <div className="space-y-2 p-3 bg-muted/50 rounded">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">{customerInfo.name}</div>
                  <div className="text-muted-foreground">
                    {customerInfo.phone}
                  </div>
                  <div className="text-muted-foreground">
                    {customerInfo.address}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Please ensure your delivery information is correct before
                confirming the order.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-sm">Delivery Details</h5>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 border rounded">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Estimated Delivery</div>
                <div className="text-muted-foreground">2-5 business days</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Delivery Charge</div>
                <div className="text-muted-foreground">
                  Calculated at checkout
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-sm">Cash on Delivery Information</h5>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Pay the full amount when you receive your order</li>
            <li>• Please keep the exact amount ready for smooth delivery</li>
            <li>• Check your order items before making payment</li>
            <li>
              • Our delivery partner will provide you with an official receipt
            </li>
            <li>• No advance payment required</li>
          </ul>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="cod-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          />
          <div className="space-y-1">
            <label
              htmlFor="cod-terms"
              className="text-sm font-medium cursor-pointer"
            >
              I agree to the Cash on Delivery terms
            </label>
            <p className="text-xs text-muted-foreground">
              I confirm that I will pay the full order amount upon delivery and
              have read the terms and conditions.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleConfirmOrder}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!acceptedTerms || isConfirming}
        >
          {isConfirming ? "Confirming..." : "Confirm Order"}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• You can cancel your order before delivery</p>
          <p>• For order modifications, contact our support team</p>
          <p>• Our delivery team will call you before arrival</p>
        </div>
      </CardContent>
    </Card>
  );
}
