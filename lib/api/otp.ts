// API utilities for OTP verification

interface SendOTPRequest {
  shop_id: number | string;
  phone: string;
}

interface SendOTPResponse {
  status: boolean;
  message: string;
  data?: {
    otp_id?: string;
    expires_at?: number;
  };
}

interface VerifyOTPRequest {
  shop_id: number | string;
  phone: string;
  otp: string;
}

interface VerifyOTPResponse {
  status: boolean;
  message: string;
  data?: {
    verified_at?: number;
    expires_at?: number;
  };
}

/**
 * Send OTP to phone number
 */
export const sendOTP = async (
  payload: SendOTPRequest
): Promise<SendOTPResponse> => {
  try {
    // In development mode, simulate the API call
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success
      return {
        status: true,
        message: "OTP sent successfully",
        data: {
          otp_id: "demo_otp_id",
          expires_at: Date.now() + 5 * 60 * 1000, // 5 minutes
        },
      };
    }

    // Production API call
    const response = await fetch("/api/v1/live/order-verification/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Encrypt payload in production
        payload: encryptData ? encryptData(payload) : payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Decrypt data in production
    const decryptedData = decryptData ? decryptData(data) : data;

    return decryptedData;
  } catch (error) {
    console.error("Error sending OTP:", error);

    // Return error response
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    };
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
  payload: VerifyOTPRequest
): Promise<VerifyOTPResponse> => {
  try {
    // In development mode, simulate the API call
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, accept "1234" as valid OTP
      if (payload.otp === "1234") {
        return {
          status: true,
          message: "Phone number verified successfully",
          data: {
            verified_at: Date.now(),
            expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
          },
        };
      } else {
        return {
          status: false,
          message: "Invalid OTP code",
        };
      }
    }

    // Production API call
    const response = await fetch("/api/v1/live/order-verification/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Encrypt payload in production
        payload: encryptData ? encryptData(payload) : payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Decrypt data in production
    const decryptedData = decryptData ? decryptData(data) : data;

    return decryptedData;
  } catch (error) {
    console.error("Error verifying OTP:", error);

    // Return error response
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to verify OTP",
    };
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (
  payload: SendOTPRequest
): Promise<SendOTPResponse> => {
  try {
    // In development mode, simulate the API call
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success
      return {
        status: true,
        message: "OTP resent successfully",
        data: {
          otp_id: "demo_otp_id_resend",
          expires_at: Date.now() + 5 * 60 * 1000, // 5 minutes
        },
      };
    }

    // Production API call
    const response = await fetch("/api/v1/live/order-verification/resend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Encrypt payload in production
        payload: encryptData ? encryptData(payload) : payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Decrypt data in production
    const decryptedData = decryptData ? decryptData(data) : data;

    return decryptedData;
  } catch (error) {
    console.error("Error resending OTP:", error);

    // Return error response
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to resend OTP",
    };
  }
};

// Mock encryption/decryption functions (implement real ones in production)
const encryptData = (data: any): string => {
  // In production, implement proper encryption
  return btoa(JSON.stringify(data));
};

const decryptData = (encryptedData: string): any => {
  // In production, implement proper decryption
  try {
    return JSON.parse(atob(encryptedData));
  } catch {
    return encryptedData;
  }
};