import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PaymentType, PaymentStatus } from '@/lib/payments/types';
import { updateOrderPaymentStatus } from '@/lib/orders/order-manager';

// Nagad webhook signature verification
function verifyNagadSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get Nagad secret from environment
    const nagadSecret = process.env.NAGAD_WEBHOOK_SECRET;
    if (!nagadSecret) {
      console.error('NAGAD_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-nagad-signature');

    if (!signature) {
      console.error('Missing Nagad signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifyNagadSignature(body, signature, nagadSecret)) {
      console.error('Invalid Nagad signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook data
    const webhookData = JSON.parse(body);

    // Validate required fields
    if (!webhookData.orderId || !webhookData.order_status || !webhookData.payment_ref_id) {
      console.error('Missing required fields in Nagad webhook');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Map Nagad status to our payment status
    const paymentStatus = webhookData.order_status === 'Success'
      ? PaymentStatus.SUCCESS
      : webhookData.order_status === 'Pending'
      ? PaymentStatus.PROCESSING
      : PaymentStatus.FAILED;

    // Extract receipt ID from order ID
    const receiptId = webhookData.orderId;

    // Update order payment status
    const updateResponse = await updateOrderPaymentStatus({
      receiptId,
      paymentType: PaymentType.NAGAD,
      transactionId: webhookData.payment_ref_id,
      status: paymentStatus,
      amount: parseFloat(webhookData.amount || '0'),
      gatewayResponse: webhookData,
    });

    if (updateResponse.success) {
      console.log(`Nagad webhook processed successfully for receipt ${receiptId}`);

      // Return success response to Nagad
      return NextResponse.json({
        statusCode: 200,
        statusMessage: 'Success',
      });
    } else {
      console.error(`Failed to update order ${receiptId}:`, updateResponse.error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Nagad webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Health check for webhook
export async function GET() {
  return NextResponse.json({
    status: 'active',
    gateway: 'nagad',
    timestamp: new Date().toISOString(),
  });
}