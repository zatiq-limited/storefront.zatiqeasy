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
  accentColor?: string;
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
    accentColor = "#2563EB",
    title = "Send Us a Message",
    subtitle = "Fill out the form and we'll get back to you",
    submitButtonText = "Send Message",
    submitButtonColor = "#2563EB",
    successMessage = "Thank you! Your message has been sent successfully.",
    errorMessage = "Oops! Something went wrong. Please try again.",
    sideImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  } = settings;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const defaultFields: FormField[] = [
    {
      id: "1",
      type: "form_field",
      settings: { name: "name", label: "Full Name", type: "text", placeholder: "Enter your name", required: true },
    },
    {
      id: "2",
      type: "form_field",
      settings: { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    },
    {
      id: "3",
      type: "form_field",
      settings: { name: "phone", label: "Phone", type: "tel", placeholder: "Your phone number", required: false },
    },
    {
      id: "4",
      type: "form_field",
      settings: { name: "message", label: "Message", type: "textarea", placeholder: "Your message", required: true, rows: 4 },
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
    <section className="w-full py-16 md:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="hidden lg:block">
            <img
              src={sideImage}
              alt="Contact us"
              className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Side - Form */}
          <div>
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: textColor }}
              >
                {title}
              </h2>
              <p className="text-gray-600 text-lg">{subtitle}</p>
            </div>

            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-green-800 text-lg font-medium">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={field.settings.type === "textarea" ? "md:col-span-2" : ""}
                    >
                      <label
                        htmlFor={field.settings.name}
                        className="block text-sm font-medium mb-2"
                        style={{ color: textColor }}
                      >
                        {field.settings.label}
                        {field.settings.required && <span className="text-red-500 ml-1">*</span>}
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
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50"
                          style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
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
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50"
                          style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {status === "error" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-8 w-full py-4 px-6 rounded-lg text-white font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: submitButtonColor }}
                >
                  {status === "loading" ? "Sending..." : submitButtonText}
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
