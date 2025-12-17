'use client';

/**
 * ========================================
 * CHECKOUT PAGE RENDERER
 * ========================================
 *
 * Special renderer for checkout page that passes order and promo code data to components
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_code?: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface DeliveryInfo {
  id: number;
  consignment_id: string;
  tracking_code: string;
  delivery_service: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_area: string;
  recipient_city: {
    id: number;
    name: string;
  };
  recipient_zone: {
    id: number;
    name: string;
  };
  delivery_type: {
    code: string;
    name: string;
  };
  item_type: {
    code: string;
    name: string;
  };
  special_instruction: string;
  item_description: string;
  item_quantity: number;
  item_weight: number;
  amount_to_collect: number;
  delivery_fee: number;
  last_status: string;
  created_at: string;
}

interface Transaction {
  id: number;
  transaction_id: string;
  payment_id: string;
  payment_gateway: string;
  invoice_id: string;
  amount: number;
  status: string;
  self_mfs: boolean;
  created_at: string;
}

interface Order {
  id: number;
  serial: number;
  customer_name: string;
  customer_phone: string;
  email: string;
  customer_address: string;
  delivery: DeliveryInfo;
  transactions: Transaction[];
  status: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  delivery_time: string;
  fee: number;
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  enabled: boolean;
  fee: number;
  fee_type: string;
}

interface CheckoutPageRendererProps {
  sections: Section[];
  order?: Order;
  deliveryOptions?: DeliveryOption[];
  paymentMethods?: PaymentMethod[];
  currency?: string;
  className?: string;
}

export default function CheckoutPageRenderer({
  sections,
  order,
  deliveryOptions = [],
  paymentMethods = [],
  currency = "BDT",
  className = "",
}: CheckoutPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) {
      return null;
    }

    const Component = getComponent(section.type);

    if (!Component) {
      if (process.env.DEV) {
        return (
          <div key={section.id} className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4">
            <p className="text-yellow-800 font-semibold">
              Component not found: {section.type}
            </p>
          </div>
        );
      }
      return null;
    }

    // Prepare props based on component type
    let componentProps: any = {
      ...section.settings,
      settings: section.settings,
      blocks: section.blocks,
    };

    // Inject order data for checkout components
    if (section.type.includes("checkout-content")) {
      componentProps.orderItems = order?.items || [];
      componentProps.deliveryOptions = deliveryOptions;
      componentProps.paymentMethods = paymentMethods;
      componentProps.customerInfo = order ? {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.email,
        address: order.customer_address,
      } : undefined;
      componentProps.currency = currency;
    }

    // Inject hero data
    if (section.type.includes("checkout-hero")) {
      // Hero props are already in settings
    }

    return (
      <div
        key={section.id}
        data-section-id={section.id}
        data-section-type={section.type}
        className="zatiq-section"
      >
        <Component {...componentProps} />
      </div>
    );
  };

  return (
    <div className={`zatiq-checkout-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
