import React, { useState } from "react";

interface FormField {
  id: string;
  type: string;
  settings: {
    name?: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
  };
}

interface ContactForm1Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  submitButtonColor?: string;
  formEndpoint?: string;
  successMessage?: string;
  errorMessage?: string;
  showTermsCheckbox?: boolean;
  termsText?: string;
}

interface ContactForm1Props {
  settings?: ContactForm1Settings;
  blocks?: FormField[];
}

const ContactForm1: React.FC<ContactForm1Props> = ({ settings = {}, blocks = [] }) => {
  const {
    backgroundColor,
    textColor,
    title,
    subtitle,
    submitButtonText,
    submitButtonColor,
    successMessage,
    errorMessage,
    showTermsCheckbox = false,
    termsText,
  } = settings;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // If no blocks provided, don't render
  if (blocks.length === 0) return null;

  // Separate textarea fields from other fields
  const textareaFields = blocks.filter((field) => field.settings.type === "textarea");
  const otherFields = blocks.filter((field) => field.settings.type !== "textarea");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setFormData({});
      setTermsAccepted(false);
    }, 1500);
  };

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: backgroundColor || "#FFFFFF" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-12">
            {subtitle && (
              <p className="text-gray-500 text-base mb-2">{subtitle}</p>
            )}
            {title && (
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
                style={{ color: textColor || "#111827" }}
              >
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Form */}
        {status === "success" ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: textColor || "#111827" }}
            >
              Message Sent!
            </h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button
              onClick={() => setStatus("idle")}
              className="px-6 py-3 rounded-full font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: submitButtonColor || "#111827" }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column - Text/Email/Tel Fields */}
              <div className="space-y-4">
                {otherFields.map((field) => (
                  <div key={field.id}>
                    <input
                      id={field.settings.name}
                      name={field.settings.name}
                      type={field.settings.type || "text"}
                      placeholder={field.settings.placeholder}
                      required={field.settings.required}
                      value={formData[field.settings.name || ""] || ""}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                      style={{ color: textColor || "#111827" }}
                    />
                  </div>
                ))}

                {/* Terms Checkbox */}
                {showTermsCheckbox && termsText && (
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-500 leading-relaxed"
                    >
                      {termsText}
                    </label>
                  </div>
                )}
              </div>

              {/* Right Column - Textarea */}
              <div className="flex flex-col">
                {textareaFields.map((field) => (
                  <textarea
                    key={field.id}
                    id={field.settings.name}
                    name={field.settings.name}
                    placeholder={field.settings.placeholder}
                    required={field.settings.required}
                    rows={field.settings.rows || 6}
                    value={formData[field.settings.name || ""] || ""}
                    onChange={handleChange}
                    className="w-full h-full min-h-[200px] px-6 py-4 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:border-gray-400 transition-colors text-sm resize-none"
                    style={{ color: textColor || "#111827" }}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {status === "error" && errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={status === "loading" || (showTermsCheckbox && !termsAccepted)}
                className="px-8 py-3.5 rounded-full text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: submitButtonColor || "#111827" }}
              >
                {status === "loading" ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>{submitButtonText || "Send Message"}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm1;
