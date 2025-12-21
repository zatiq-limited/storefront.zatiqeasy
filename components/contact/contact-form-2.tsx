"use client";

import { useState } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";

interface ContactForm2Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  titleStyle?: 'script' | 'normal';
  submitButtonText?: string;
  submitButtonColor?: string;
  successMessage?: string;
  errorMessage?: string;
  showTermsCheckbox?: boolean;
  termsText?: string;
}

interface ContactForm2Props {
  settings?: ContactForm2Settings;
}

export default function ContactForm2({ settings = {} }: ContactForm2Props) {
  const s = convertSettingsKeys<ContactForm2Settings>(settings);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          terms: false,
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subject field */}
          <div className="mb-6">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Message field */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Terms checkbox */}
          {s.showTermsCheckbox && (
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {s.termsText || 'I accept the terms & conditions and I understand that my data will be hold securely in accordance with the privacy policy.'}
                </span>
              </label>
            </div>
          )}

          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: s.submitButtonColor || '#8B4513' }}
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