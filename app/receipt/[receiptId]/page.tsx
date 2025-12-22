"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Loader2 } from "lucide-react";
import { getReceiptDetails } from "@/lib/payments/api";
import type { OrderItem } from "@/lib/payments/types";
import { getInventoryThumbImageUrl } from "@/lib/utils";
import getSymbolFromCurrency from "currency-symbol-map";

// Receipt data structure from API (matching old project)
// Extended from ReceiptDetails with additional API response fields
interface ReceiptData extends Omit<OrderItem, "name" | "price"> {
  id: number;
  receipt_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  email?: string;
  note?: string;
  notes?: string;
  type: string;
  status: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  delivery_charge?: number;
  paid_amount: number;
  serial?: number;
  receipt_items: OrderItem[];
  shop_name?: {
    id: number;
    shop_name: string;
    shop_phone: string;
    shop_email: string;
    address: string;
    image_url: string;
    country_currency: string;
    payment_methods: string;
    theme_color?: {
      primary_color: string;
    };
  };
}

export default function ReceiptPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<ReceiptData | null>(null);

  const receiptId = params.receiptId as string;

  const fetchReceiptDetails = useCallback(async () => {
    try {
      const response = await getReceiptDetails(receiptId);
      console.log("Receipt response:", response);
      if (response.success && response.data) {
        setOrderDetails(response.data as unknown as ReceiptData);
      } else {
        setError(response.error || "Failed to fetch receipt details");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [receiptId]);

  useEffect(() => {
    if (!receiptId) {
      setError("Receipt ID not found");
      setLoading(false);
      return;
    }

    fetchReceiptDetails();
  }, [receiptId, fetchReceiptDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-red-600">{error || "Receipt not found"}</p>
      </div>
    );
  }

  const primaryColor =
    orderDetails.shop_name?.theme_color?.primary_color || "#000000";
  const currencySymbol =
    getSymbolFromCurrency(orderDetails.shop_name?.country_currency || "BDT") ||
    "৳";

  const applyOpacityToHexColor = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getReceiptItemUrl = (item: OrderItem) => {
    return item.image_url || "";
  };

  return (
    <>
      <div className="">
        <div className="w-full py-3 px-3 flex flex-col justify-center items-center">
          <div className="rounded-4xl w-full lg:max-w-4xl">
            <div className="flex flex-col gap-3">
              {/* Shop Information */}
              <div
                className="flex flex-col md:flex-row gap-5 my-5 p-4 shadow-md text-black-27 rounded-2xl md:items-center"
                style={{
                  backgroundColor: applyOpacityToHexColor(primaryColor, 0.3),
                }}
              >
                <div className="">
                  <FallbackImage
                    src={orderDetails.shop_name?.image_url || ""}
                    className="object-contain"
                    alt=""
                    width={150}
                    height={150}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      Name:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.shop_name?.shop_name || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      Address:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.shop_name?.address || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      Phone:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.shop_name?.shop_phone || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      Email:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.shop_name?.shop_email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="flex flex-col gap-1 my-2">
                <div className="flex gap-2">
                  <h2 className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                    Customer Information
                  </h2>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Name:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.customer_name || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Address:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.customer_address || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Number:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.customer_phone || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Email:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      {orderDetails.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="flex flex-col gap-1 my-2">
                <div className="flex gap-2">
                  <h2 className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                    Item Details
                  </h2>
                </div>
                {orderDetails.receipt_items?.map(
                  (item: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 p-2 my-2 shadow-md border rounded-2xl items-center"
                      style={{ borderColor: primaryColor }}
                    >
                      <div className="w-1/5">
                        <FallbackImage
                          src={getInventoryThumbImageUrl(
                            getReceiptItemUrl(item)
                          )}
                          className="cursor-pointer rounded-xl object-cover w-25"
                          alt=""
                          width={90}
                          height={90}
                        />
                      </div>
                      <div className="flex flex-col w-2/5 py-2">
                        <div className="flex gap-2">
                          <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                            Name:{" "}
                          </div>
                          <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                            {item.name || "N/A"}
                          </div>
                        </div>
                        {item.warranty && (
                          <div className="flex gap-2">
                            <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                              Warranty:{" "}
                            </div>
                            <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                              {item.warranty}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col w-2/5">
                        <div className="flex gap-2">
                          <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                            Quantity:{" "}
                          </div>
                          <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                            {item.qty || "N/A"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                            Price:{" "}
                          </div>
                          <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                            {item.price || "N/A"} {currencySymbol}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Order Details */}
              <div>
                <div className="flex gap-2">
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                    Note:{" "}
                  </div>
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                    {orderDetails.note || orderDetails.notes || "N/A"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                    Bill ID:{" "}
                  </div>
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                    #{orderDetails.id || orderDetails.receipt_id || "N/A"}
                  </div>
                </div>
                {orderDetails.serial && (
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Serial ID:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                      #{orderDetails.serial}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                    Order Type:{" "}
                  </div>
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                    {orderDetails.type || "N/A"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                    Order Status:{" "}
                  </div>
                  <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                    {orderDetails.status || "N/A"}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="flex flex-col gap-3 my-2">
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Discount:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      {orderDetails.discount_amount || "0"} {currencySymbol}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Vat/Tax:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      {orderDetails.tax_amount || "0"} {currencySymbol}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Delivery Charge:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      {orderDetails.delivery_charge || "0"} {currencySymbol}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Total Price:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      {orderDetails.total_amount || "N/A"} {currencySymbol}
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold truncate">
                      Paid Amount:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                      {orderDetails.paid_amount || "0"} {currencySymbol}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] text-red-600 font-bold truncate">
                      Due Amount:{" "}
                    </div>
                    <div className="text-[14px] md:text-[16px] lg:text-[20px] text-red-600 font-bold">
                      {(orderDetails.total_amount ?? 0) -
                        (orderDetails.paid_amount ?? 0) || "0"}{" "}
                      {currencySymbol}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-1">
                <button
                  type="button"
                  className="max-w-87.5 h-13.25 border font-medium rounded-full text-sm px-6.75 text-center m-2"
                  onClick={() => {
                    window.location.assign(
                      `${
                        process.env.NEXT_PUBLIC_PAYMENT_API_URL ||
                        "https://easybill.zatiq.tech/api/v1"
                      }/receipts/${receiptId}/download`
                    );
                  }}
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  Download the Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
