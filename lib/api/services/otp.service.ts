/**
 * OTP API Service
 * Phone verification and OTP management
 */

import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResendOTPRequest,
  ResendOTPResponse,
} from "../types";

const OTP_API_BASE = process.env.NEXT_PUBLIC_OTP_API_URL || "/api/otp";

export const otpService = {
  /**
   * Send OTP to phone number
   */
  async sendOTP(payload: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      // In development mode, simulate the API call
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          status: true,
          message: "OTP sent successfully (dev mode)",
          data: {
            otp_id: "demo_otp_id",
            expires_at: Date.now() + 5 * 60 * 1000, // 5 minutes
          },
        };
      }

      const response = await fetch(`${OTP_API_BASE}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Send OTP error:", error);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      return {
        status: false,
        message: errorMessage,
      };
    }
  },

  /**
   * Verify OTP code
   */
  async verifyOTP(payload: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      // In development mode, simulate the API call
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate success for any 6-digit OTP
        if (payload.otp.length === 6) {
          return {
            status: true,
            message: "OTP verified successfully (dev mode)",
            data: {
              verified_at: Date.now(),
              expires_at: Date.now() + 30 * 60 * 1000, // 30 minutes
            },
          };
        }

        return {
          status: false,
          message: "Invalid OTP (dev mode)",
        };
      }

      const response = await fetch(`${OTP_API_BASE}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Verify OTP error:", error);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify OTP";
      return {
        status: false,
        message: errorMessage,
      };
    }
  },

  /**
   * Resend OTP
   */
  async resendOTP(payload: ResendOTPRequest): Promise<ResendOTPResponse> {
    try {
      // In development mode, simulate the API call
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          status: true,
          message: "OTP resent successfully (dev mode)",
          data: {
            otp_id: "demo_otp_id_resend",
            expires_at: Date.now() + 5 * 60 * 1000, // 5 minutes
          },
        };
      }

      const response = await fetch(`${OTP_API_BASE}/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Resend OTP error:", error);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";
      return {
        status: false,
        message: errorMessage,
      };
    }
  },
};
