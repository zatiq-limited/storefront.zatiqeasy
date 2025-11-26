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

interface ContactForm2Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  submitButtonColor?: string;
  formEndpoint?: string;
  successMessage?: string;
  errorMessage?: string;
  sideImage?: string;
}

interface ContactForm2Props {
  settings?: ContactForm2Settings;
  blocks?: FormField[];
}

const ContactForm2: React.FC<ContactForm2Props> = ({ settings = {}, blocks = [] }) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    title = "Send us a message",
    subtitle = "Fill out the form below and we'll get back to you within 24 hours.",
    submitButtonText = "Send Message",
    submitButtonColor = "#111827",
    successMessage = "Thank you for your message. We'll be in touch soon.",
    errorMessage = "Something went wrong. Please try again.",
    sideImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  } = settings;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const defaultFields: FormField[] = [
    {
      id: "1",
      type: "form_field",
      settings: { name: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
    },
    {
      id: "2",
      type: "form_field",
      settings: { name: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
    },
    {
      id: "3",
      type: "form_field",
      settings: { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?", required: false },
    },
    {
      id: "4",
      type: "form_field",
      settings: { name: "message", label: "Message", type: "textarea", placeholder: "Your message...", required: true, rows: 4 },
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
    <section className="w-full py-10 md:py-14" style={{ backgroundColor }}>
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image */}
          <div className="relative rounded-lg overflow-hidden min-h-[300px] lg:min-h-full bg-gray-100">
            <img
              src={sideImage}
              alt="Contact"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Need immediate help?</h3>
              <p className="text-sm text-white/80 mb-3">Our support team is available during business hours.</p>
              <div className="flex items-center gap-4 text-sm">
                <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <div className="mb-6">
              <h2
                className="text-2xl md:text-3xl font-semibold mb-2"
                style={{ color: textColor }}
              >
                {title}
              </h2>
              <p className="text-gray-600 text-sm">{subtitle}</p>
            </div>

            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <svg className="w-10 h-10 text-green-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900 mb-1">Message Sent</h3>
                <p className="text-green-700 text-sm">{successMessage}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm font-medium text-green-700 hover:text-green-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.settings.name}
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      {field.settings.label}
                      {field.settings.required && <span className="text-red-500 ml-0.5">*</span>}
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
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow resize-none"
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
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                      />
                    )}
                  </div>
                ))}

                {status === "error" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 px-4 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ backgroundColor: submitButtonColor }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    submitButtonText
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm2;
