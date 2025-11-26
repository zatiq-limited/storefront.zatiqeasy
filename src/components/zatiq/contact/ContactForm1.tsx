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
  accentColor?: string;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  submitButtonColor?: string;
  formEndpoint?: string;
  successMessage?: string;
  errorMessage?: string;
  backgroundImage?: string;
}

interface ContactForm1Props {
  settings?: ContactForm1Settings;
  blocks?: FormField[];
}

const ContactForm1: React.FC<ContactForm1Props> = ({ settings = {}, blocks = [] }) => {
  const {
    backgroundColor = "#F8FAFC",
    textColor = "#0F172A",
    accentColor = "#6366F1",
    title = "Send Us a Message",
    subtitle = "Fill out the form below and our team will get back to you within 24 hours",
    submitButtonText = "Send Message",
    submitButtonColor = "#6366F1",
    successMessage = "Thank you! Your message has been sent successfully.",
    errorMessage = "Oops! Something went wrong. Please try again.",
    backgroundImage = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80",
  } = settings;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const defaultFields: FormField[] = [
    {
      id: "1",
      type: "form_field",
      settings: { name: "name", label: "Your Name", type: "text", placeholder: "John Doe", required: true },
    },
    {
      id: "2",
      type: "form_field",
      settings: { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com", required: true },
    },
    {
      id: "3",
      type: "form_field",
      settings: { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?", required: false },
    },
    {
      id: "4",
      type: "form_field",
      settings: { name: "message", label: "Message", type: "textarea", placeholder: "Tell us more about your inquiry...", required: true, rows: 5 },
    },
  ];

  const fields = blocks.length > 0 ? blocks : defaultFields;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setFormData({});
    }, 1500);
  };

  return (
    <section className="relative w-full py-4 md:py-8 overflow-hidden" style={{ backgroundColor }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Get in Touch
          </span>

          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">{subtitle}</p>
        </div>

        {/* Form Card */}
        {status === "success" ? (
          <div
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center border border-gray-100"
            style={{
              boxShadow: `0 25px 50px -12px ${accentColor}15`,
            }}
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#10B98115' }}
            >
              <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>Message Sent!</h3>
            <p className="text-gray-600 text-sm">{successMessage}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-5 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
            style={{
              boxShadow: `0 25px 50px -12px ${accentColor}10`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={field.settings.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <label
                    htmlFor={field.settings.name}
                    className="block text-sm font-semibold mb-2 transition-colors duration-200"
                    style={{
                      color: focusedField === field.settings.name ? accentColor : textColor
                    }}
                  >
                    {field.settings.label}
                    {field.settings.required && (
                      <span className="ml-1" style={{ color: accentColor }}>*</span>
                    )}
                  </label>

                  {field.settings.type === "textarea" ? (
                    <textarea
                      id={field.settings.name}
                      name={field.settings.name}
                      placeholder={field.settings.placeholder}
                      required={field.settings.required}
                      rows={field.settings.rows || 4}
                      value={formData[field.settings.name || ""] || ""}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.settings.name || null)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none transition-all duration-200 resize-none text-sm"
                      style={{
                        borderColor: focusedField === field.settings.name ? accentColor : undefined,
                        boxShadow: focusedField === field.settings.name ? `0 0 0 4px ${accentColor}15` : undefined,
                      }}
                    />
                  ) : (
                    <input
                      id={field.settings.name}
                      name={field.settings.name}
                      type={field.settings.type || "text"}
                      placeholder={field.settings.placeholder}
                      required={field.settings.required}
                      value={formData[field.settings.name || ""] || ""}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.settings.name || null)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none transition-all duration-200 text-sm"
                      style={{
                        borderColor: focusedField === field.settings.name ? accentColor : undefined,
                        boxShadow: focusedField === field.settings.name ? `0 0 0 4px ${accentColor}15` : undefined,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {status === "error" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              style={{
                backgroundColor: submitButtonColor,
                boxShadow: `0 10px 30px -10px ${submitButtonColor}`,
              }}
            >
              {status === "loading" ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  {submitButtonText}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm1;
