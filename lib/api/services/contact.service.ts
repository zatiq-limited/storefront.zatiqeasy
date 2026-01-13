/**
 * Contact API Service
 * Handle contact form submissions
 */

import { apiClient } from "../client";
import type { ContactFormPayload, ContactFormResponse } from "../types";

export const contactService = {
  /**
   * Submit contact form
   */
  async submitContactForm(
    payload: ContactFormPayload
  ): Promise<ContactFormResponse> {
    try {
      const { data } = await apiClient.post<{ message?: string }>(
        "/api/contact/submit",
        payload
      );

      return {
        success: true,
        message: data?.message || "Message sent successfully",
      };
    } catch (error) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Contact form submission error:", error);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit contact form";
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
};
