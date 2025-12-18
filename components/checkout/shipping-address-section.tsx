"use client";

import { useCheckoutStore } from "@/stores";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ShippingAddressSectionProps {
  className?: string;
}

export function ShippingAddressSection({ className }: ShippingAddressSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Full Name *</Label>
          <Input
            id="customer-name"
            placeholder="Enter your full name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-email">Email (Optional)</Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="Enter your email for order confirmation"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-address">Street Address *</Label>
          <textarea
            id="customer-address"
            placeholder="Enter your complete delivery address"
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "resize-none"
            )}
            rows={3}
          />
        </div>

        <DeliveryZoneSelection />
      </CardContent>
    </Card>
  );
}

function DeliveryZoneSelection() {
  const {
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
    setSelectedDivision,
    setSelectedDistrict,
    setSelectedUpazila,
    setSelectedDeliveryZone,
    availableDistricts,
    availableUpazilas,
    divisions,
  } = useCheckoutStore();

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Delivery Location *</Label>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="division">Division *</Label>
          <select
            id="division"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDeliveryZone('Others');
            }}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division.name} value={division.name}>
                {division.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedDeliveryZone('Others');
            }}
            disabled={!selectedDivision}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">Select District</option>
            {availableDistricts.map((district) => (
              <option key={district.name} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="upazila">Upazila/Thana *</Label>
          <select
            id="upazila"
            value={selectedUpazila}
            onChange={(e) => {
              setSelectedUpazila(e.target.value);
              setSelectedDeliveryZone('Others');
            }}
            disabled={!selectedDistrict}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">Select Upazila/Thana</option>
            {availableUpazilas.map((upazila) => (
              <option key={upazila.name} value={upazila.name}>
                {upazila.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery-zone">Delivery Zone</Label>
          <select
            id="delivery-zone"
            value={selectedDeliveryZone}
            onChange={(e) => setSelectedDeliveryZone(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="Others">Others</option>
            <option value="Inside City">Inside City</option>
            <option value="Suburb">Suburb</option>
            <option value="Outside City">Outside City</option>
          </select>
        </div>
      </div>
    </div>
  );
}