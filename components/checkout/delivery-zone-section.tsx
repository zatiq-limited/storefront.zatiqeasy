"use client";

import { useCheckoutStore } from "@/stores";
import { Truck, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DeliveryZoneSectionProps {
  className?: string;
  deliveryCharges?: Record<string, { amount: number; days: string }>;
}

const defaultDeliveryCharges = {
  "Inside City": {
    amount: 50,
    days: "1-2",
  },
  "Suburb": {
    amount: 80,
    days: "2-3",
  },
  "Outside City": {
    amount: 120,
    days: "3-5",
  },
  "Others": {
    amount: 150,
    days: "4-7",
  },
};

export function DeliveryZoneSection({
  className,
  deliveryCharges = defaultDeliveryCharges,
}: DeliveryZoneSectionProps) {
  const {
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
  } = useCheckoutStore();

  const hasCompleteLocation = selectedDivision && selectedDistrict && selectedUpazila;

  const zones = Object.entries(deliveryCharges).map(([zone, info]) => ({
    id: zone,
    name: zone,
    charge: info.amount,
    estimatedDays: info.days,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Delivery Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasCompleteLocation ? (
          <div className="text-center py-6 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Please complete your delivery address to see available delivery options
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                    selectedDeliveryZone === zone.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedDeliveryZone(zone.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2",
                        selectedDeliveryZone === zone.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {selectedDeliveryZone === zone.id && (
                        <div className="w-full h-full rounded-full bg-primary scale-50" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{zone.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{zone.estimatedDays} days</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    ৳{zone.charge}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <p className="mb-1">
                <strong>Inside City:</strong> Major metropolitan areas
              </p>
              <p className="mb-1">
                <strong>Suburb:</strong> Areas within city boundaries
              </p>
              <p className="mb-1">
                <strong>Outside City:</strong> Areas outside city limits
              </p>
              <p>
                <strong>Others:</strong> Remote areas and special locations
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}