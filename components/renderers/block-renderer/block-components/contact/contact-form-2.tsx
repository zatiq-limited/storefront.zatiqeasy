"use client";

import { useState } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";

interface FormField {
  id: string;
  type: string;
  settings: {
    name: string;
    label?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    width?: string;
    rows?: number;
  };
}

interface ContactForm2Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  titleStyle?: 'script' | 'normal';
  submitButtonText?: string;
  submitButtonBgColor?: string;
  submitButtonTextColor?: string;
  inputBgColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholderColor?: string;
  labelColor?: string;
  successMessage?: string;
  errorMessage?: string;
  showTerms?: boolean;
  termsText?: string;
}

interface ContactForm2Props {
  settings?: ContactForm2Settings;
  blocks?: FormField[];
}

export default function ContactForm2({ settings = {}, blocks = [] }: ContactForm2Props) {
  const s = convertSettingsKeys(settings as Record<string, unknown>) as ContactForm2Settings;
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Use blocks from builder
  const formFields = blocks.length > 0 ? blocks : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({});
        setTermsAccepted(false);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Separate full-width and half-width fields
  const fullWidthFields = formFields.filter((field) => 
    field.settings.width === 'full' || field.settings.type === 'textarea'
  );
  const halfWidthFields = formFields.filter((field) => 
    field.settings.width === 'half' && field.settings.type !== 'textarea'
  );

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || '#F9FAFB' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              s.titleStyle === 'script' ? 'font-serif italic' : ''
            }`}
            style={{ color: s.textColor || '#111827' }}
          >
            {s.title || 'Keep in touch with us'}
          </h2>
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {/* Half-width fields in grid */}
          {halfWidthFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {halfWidthFields.map((field) => (
                <div key={field.id}>
                  {field.settings.label && (
                    <label
                      htmlFor={field.settings.name}
                      className="block text-sm font-medium mb-2"
                      style={{ color: s.labelColor || '#374151' }}
                    >
                      {field.settings.label}
                    </label>
                  )}
                  <input
                    type={field.settings.type || 'text'}
                    id={field.settings.name}
                    name={field.settings.name}
                    placeholder={field.settings.placeholder}
                    value={(formData[field.settings.name] as string) || ''}
                    onChange={handleInputChange}
                    required={field.settings.required}
                    className="w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      backgroundColor: s.inputBgColor || '#FFFFFF',
                      borderColor: s.inputBorderColor || '#E5E7EB',
                      color: s.inputTextColor || '#1F2937',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Full-width fields */}
          {fullWidthFields.map((field) => (
            <div key={field.id} className="mb-6">
              {field.settings.label && (
                <label
                  htmlFor={field.settings.name}
                  className="block text-sm font-medium mb-2"
                  style={{ color: s.labelColor || '#374151' }}
                >
                  {field.settings.label}
                </label>
              )}
              {field.settings.type === 'textarea' ? (
                <textarea
                  id={field.settings.name}
                  name={field.settings.name}
                  rows={field.settings.rows || 6}
                  placeholder={field.settings.placeholder}
                  value={(formData[field.settings.name] as string) || ''}
                  onChange={handleInputChange}
                  required={field.settings.required}
                  className="w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    backgroundColor: s.inputBgColor || '#FFFFFF',
                    borderColor: s.inputBorderColor || '#E5E7EB',
                    color: s.inputTextColor || '#1F2937',
                  }}
                />
              ) : (
                <input
                  type={field.settings.type || 'text'}
                  id={field.settings.name}
                  name={field.settings.name}
                  placeholder={field.settings.placeholder}
                  value={(formData[field.settings.name] as string) || ''}
                  onChange={handleInputChange}
                  required={field.settings.required}
                  className="w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    backgroundColor: s.inputBgColor || '#FFFFFF',
                    borderColor: s.inputBorderColor || '#E5E7EB',
                    color: s.inputTextColor || '#1F2937',
                  }}
                />
              )}
            </div>
          ))}

          {/* Terms checkbox */}
          {s.showTerms && s.termsText && (
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {s.termsText}
                </span>
              </label>
            </div>
          )}

          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || (s.showTerms && !termsAccepted)}
              className="px-8 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: s.submitButtonBgColor || '#8B4513',
                color: s.submitButtonTextColor || '#FFFFFF'
              }}
            >
              {isSubmitting ? 'SENDING...' : (s.submitButtonText || 'SEND MESSAGE')}
            </button>
          </div>

          {/* Success message */}
          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {s.successMessage || 'Thank you! Your message has been sent successfully.'}
            </div>
          )}

          {/* Error message */}
          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {s.errorMessage || 'Oops! Something went wrong. Please try again.'}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}