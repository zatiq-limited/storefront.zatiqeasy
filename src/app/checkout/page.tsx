/**
 * ========================================
 * CHECKOUT PAGE
 * ========================================
 */

import { getCheckoutPageData } from "@/api/server";
import CheckoutPageRenderer from "@/components/CheckoutPageRenderer";

export default async function CheckoutPage() {
  const pageData = await getCheckoutPageData();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = pageData as any;

  return (
    <CheckoutPageRenderer
      sections={data?.sections || []}
      order={data?.order}
      deliveryOptions={data?.delivery_options || data?.deliveryOptions}
      paymentMethods={data?.payment_methods || data?.paymentMethods}
      currency={data?.currency}
    />
  );
}

export const metadata = {
  title: "Checkout | Zatiq Store",
  description: "Complete your purchase",
};
