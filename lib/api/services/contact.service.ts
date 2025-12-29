/**
 * Contact API Service
 * Handle contact form submissions
 */

import type { ContactFormPayload, ContactFormResponse } from "../types";

const CONTACT_API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/contact";

export const contactService = {
  /**
   * Submit contact form
   */
  async submitContactForm(
    payload: ContactFormPayload
  ): Promise<ContactFormResponse> {
    try {
      const response = await fetch(`${CONTACT_API_BASE}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Message sent successfully",
      };
    } catch (error) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "development") {
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
