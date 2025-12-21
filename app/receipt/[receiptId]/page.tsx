"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download, Share2, ArrowLeft, ExternalLink, Package, Truck, CheckCircle } from 'lucide-react';
import { getReceiptDetails, downloadReceipt } from '@/lib/payments/api';
import { PaymentStatus, PaymentType, OrderStatus } from '@/lib/payments/types';
import { formatPrice, getPaymentStatusText, getPaymentStatusColor, getOrderStatusText, getOrderStatusColor } from '@/lib/payments/utils';
import { orderManager } from '@/lib/orders/order-manager';

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  const receiptId = params.receiptId as string;

  useEffect(() => {
    if (!receiptId) {
      setError('Receipt ID not found');
      setLoading(false);
      return;
    }

    fetchReceiptDetails();
  }, [receiptId]);

  const fetchReceiptDetails = async () => {
    try {
      const response = await getReceiptDetails(receiptId);
      if (response.success && response.data) {
        setOrderDetails(response.data);
      } else {
        setError(response.error || 'Failed to fetch receipt details');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReceipt(receiptId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receiptId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to download receipt');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (orderDetails) {
      const url = orderManager.generateWhatsAppMessage(orderDetails);
      window.open(url, '_blank');
    }
  };

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return <CheckCircle className="h-5 w-5" />;
      case OrderStatus.SHIPPED:
        return <Truck className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error || 'Receipt not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const subtotal = orderDetails.receipt_items.reduce((sum: number, item: any) => sum + item.total_price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order Receipt</h1>
              <p className="text-gray-600">Receipt ID: {orderDetails.receipt_id}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShareWhatsApp}
                size="sm"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadReceipt}
                disabled={downloading}
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloading ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getOrderStatusIcon(orderDetails.status)}
                Order Status: <span style={{ color: getOrderStatusColor(orderDetails.status) }}>
                  {getOrderStatusText(orderDetails.status)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <Badge
                  style={{
                    backgroundColor: getPaymentStatusColor(orderDetails.payment_status),
                    color: 'white'
                  }}
                >
                  {getPaymentStatusText(orderDetails.payment_status)}
                </Badge>
              </div>

              {orderDetails.transaction_id && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono">{orderDetails.transaction_id}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="capitalize">{orderDetails.payment_type}</span>
              </div>

              <Separator />

              {/* Customer Information */}
              <div>
                <h3 className="font-medium mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{orderDetails.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{orderDetails.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium">{orderDetails.customer_address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.receipt_items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600">{item.variant_name}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.total_price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {orderDetails.delivery_charge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Charge:</span>
                    <span>{formatPrice(orderDetails.delivery_charge)}</span>
                  </div>
                )}
                {orderDetails.tax_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>{formatPrice(orderDetails.tax_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>{formatPrice(orderDetails.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Paid Amount:</span>
                  <span>{formatPrice(orderDetails.paid_amount || 0)}</span>
                </div>
                {orderDetails.due_amount > 0 && (
                  <div className="flex justify-between text-sm font-medium text-orange-600">
                    <span>Due Amount:</span>
                    <span>{formatPrice(orderDetails.due_amount)}</span>
                  </div>
                )}
              </div>

              {orderDetails.payment_status === PaymentStatus.FAILED && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Payment failed. Please retry payment or contact support.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Order Placed</p>
                      <p className="text-xs text-gray-600">
                        {new Date(orderDetails.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {orderDetails.payment_status === PaymentStatus.SUCCESS && (
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Payment Confirmed</p>
                        <p className="text-xs text-gray-600">
                          {orderDetails.paid_at ? new Date(orderDetails.paid_at).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}

                  {orderDetails.status === OrderStatus.PROCESSING && (
                    <div className="flex gap-3">
                      <Package className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Order Processing</p>
                        <p className="text-xs text-gray-600">Your order is being prepared</p>
                      </div>
                    </div>
                  )}

                  {orderDetails.status === OrderStatus.SHIPPED && (
                    <div className="flex gap-3">
                      <Truck className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Order Shipped</p>
                        <p className="text-xs text-gray-600">Your order is on the way</p>
                      </div>
                    </div>
                  )}

                  {orderDetails.status === OrderStatus.DELIVERED && (
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Order Delivered</p>
                        <p className="text-xs text-gray-600">
                          Thank you for your purchase!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Track Delivery
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Return Policy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}