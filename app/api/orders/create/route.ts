import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderPayload, OrderResponse, PaymentType, OrderStatus } from '@/lib/payments/types';
import { createOrder } from '@/lib/payments/api';
import { validatePhoneNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'shop_id',
      'customer_name',
      'customer_phone',
      'customer_address',
      'delivery_charge',
      'tax_amount',
      'total_amount',
      'payment_type',
      'pay_now_amount',
      'receipt_items'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment type
    if (!Object.values(PaymentType).includes(body.payment_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!validatePhoneNumber(body.customer_phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Create order payload
    const orderPayload: CreateOrderPayload = {
      shop_id: Number(body.shop_id),
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_address: body.customer_address,
      delivery_charge: Number(body.delivery_charge),
      tax_amount: Number(body.tax_amount),
      total_amount: Number(body.total_amount),
      payment_type: body.payment_type,
      pay_now_amount: Number(body.pay_now_amount),
      advance_payment_amount: body.advance_payment_amount ? Number(body.advance_payment_amount) : undefined,
      receipt_items: body.receipt_items,
      type: 'Online',
      status: OrderStatus.ORDER_PLACED,
      note: body.note,
    };

    // Create order through payment API
    const orderResponse: OrderResponse = await createOrder(orderPayload);

    if (orderResponse.success) {
      return NextResponse.json({
        success: true,
        data: orderResponse.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: orderResponse.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Create order API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order'
      },
      { status: 500 }
    );
  }
}