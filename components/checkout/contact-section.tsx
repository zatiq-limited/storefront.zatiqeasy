"use client";

import { useCheckoutStore } from "@/stores";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactSectionProps {
  className?: string;
}

export function ContactSection({ className }: ContactSectionProps) {
  const {
    fullPhoneNumber,
    countryCallingCode,
    setFullPhoneNumber,
    setCountryCallingCode,
    isPhoneVerified,
    setIsPhoneVerified,
  } = useCheckoutStore();

  const handlePhoneChange = (value: string) => {
    // Format phone number
    const cleanedValue = value.replace(/\D/g, "");

    if (cleanedValue.length <= 10) {
      setFullPhoneNumber(cleanedValue);
    }
  };

  const formatDisplayPhone = () => {
    if (!fullPhoneNumber) return "";

    if (fullPhoneNumber.length === 10 && fullPhoneNumber.startsWith("01")) {
      return `${countryCallingCode} ${fullPhoneNumber.slice(0, 5)} ${fullPhoneNumber.slice(5)}`;
    }

    return `${countryCallingCode} ${fullPhoneNumber}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number *</Label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <span>{countryCallingCode}</span>
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your mobile number"
              value={fullPhoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={10}
              className="flex-1"
            />
            {isPhoneVerified && (
              <span className="text-xs text-green-600 whitespace-nowrap">
                Verified
              </span>
            )}
          </div>
          {formatDisplayPhone() && (
            <p className="text-sm text-muted-foreground">
              {formatDisplayPhone()}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter your 11-digit mobile number (e.g., 01XXXXXXXXX)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}