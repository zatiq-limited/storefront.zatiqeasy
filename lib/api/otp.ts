/**
 * @deprecated Use otpService from '@/lib/api' instead
 * This file is kept for backward compatibility
 *
 * Migration:
 * import { sendOTP, verifyOTP } from '@/lib/api/otp'
 * → import { otpService } from '@/lib/api'
 * → otpService.sendOTP(payload)
 */

import { otpService } from "./services/otp.service";

export type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResendOTPRequest,
  ResendOTPResponse,
} from "./types";

/**
 * @deprecated Use otpService.sendOTP() instead
 */
export const sendOTP = otpService.sendOTP.bind(otpService);

/**
 * @deprecated Use otpService.verifyOTP() instead
 */
export const verifyOTP = otpService.verifyOTP.bind(otpService);

/**
 * @deprecated Use otpService.resendOTP() instead
 */
export const resendOTP = otpService.resendOTP.bind(otpService);
