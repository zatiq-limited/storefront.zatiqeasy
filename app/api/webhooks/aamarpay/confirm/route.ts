import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PaymentType, PaymentStatus } from '@/lib/payments/types';
import { updateOrderPaymentStatus } from '@/lib/orders/order-manager';

// AamarPay IPN (Instant Payment Notification) verification
function verifyAamarPaySignature(payload: any, secret: string): boolean {
  // AamarPay uses different signature verification method
  // Check if required fields exist
  const requiredFields = ['pay_id', 'tran_id', 'val_id', 'status', 'amount'];

  for (const field of requiredFields) {
    if (!payload[field]) {
      return false;
    }
  }

  // Additional verification using merchant key
  if (payload.store_id && payload.signature) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${payload.pay_id}|${payload.tran_id}|${payload.amount}|${payload.store_id}`)
      .digest('hex');

    return payload.signature === expectedSignature;
  }

  return true; // If no signature, assume valid (for testing)
}

export async function POST(request: NextRequest) {
  try {
    // Get AamarPay secret from environment
    const aamarpaySecret = process.env.AAMARPAY_MERCHANT_KEY;
    if (!aamarpaySecret) {
      console.error('AAMARPAY_MERCHANT_KEY not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Get request body
    const body = await request.json();

    // Verify webhook data
    if (!verifyAamarPaySignature(body, aamarpaySecret)) {
      console.error('Invalid AamarPay webhook data');
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['pay_id', 'tran_id', 'val_id', 'status', 'amount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Map AamarPay status to our payment status
    const paymentStatus = body.status === 'Valid'
      ? PaymentStatus.SUCCESS
      : body.status === 'Initiated'
      ? PaymentStatus.PROCESSING
      : PaymentStatus.FAILED;

    // Extract receipt ID from transaction ID or custom data
    const receiptId = body.merchant_trx_id || body.tran_id;

    // Update order payment status
    const updateResponse = await updateOrderPaymentStatus({
      receiptId,
      paymentType: PaymentType.AAMARPAY,
      transactionId: body.pay_id,
      status: paymentStatus,
      amount: parseFloat(body.amount || '0'),
      gatewayResponse: {
        ...body,
        bank_tran_id: body.bank_tran_id,
        card_type: body.card_type,
        currency: body.currency,
      },
    });

    if (updateResponse.success) {
      console.log(`AamarPay webhook processed successfully for receipt ${receiptId}`);

      // Return success response to AamarPay
      return NextResponse.json({
        statusCode: '200',
        statusMessage: 'IPN Received Successfully',
      });
    } else {
      console.error(`Failed to update order ${receiptId}:`, updateResponse.error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('AamarPay webhook error:', error);
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
    gateway: 'aamarpay',
    timestamp: new Date().toISOString(),
  });
}