/**
 * ========================================
 * ORDER SUCCESS PAGE
 * ========================================
 */

import { getOrderSuccessPageData } from "@/api/server";
import { OrderSuccessClient } from "./OrderSuccessClient";

export default async function OrderSuccessPage() {
  const pageData = await getOrderSuccessPageData();
  const sections = pageData?.sections || [];

  return (
    <main className="zatiq-order-success-page">
      <OrderSuccessClient sections={sections} />
    </main>
  );
}

export const metadata = {
  title: "Order Success | Zatiq Store",
  description: "Thank you for your order",
};
