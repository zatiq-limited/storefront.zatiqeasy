import React, { useState } from 'react';

interface FormField {
  id: string;
  type: string;
  settings: {
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
    rows?: number;
  };
}

interface ContactForm2Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  titleStyle?: string;
  submitButtonText?: string;
  submitButtonColor?: string;
  successMessage?: string;
  errorMessage?: string;
  showTermsCheckbox?: boolean;
  termsText?: string;
  blocks?: FormField[];
  viewMode?: 'desktop' | 'tablet' | 'mobile' | null;
}

interface ContactForm2Props {
  settings: ContactForm2Settings;
}

const ContactForm2 = ({ settings }: ContactForm2Props) => {
  const {
    backgroundColor = '#F9FAFB',
    textColor = '#111827',
    title = 'Keep in touch with us',
    titleStyle = 'script',
    submitButtonText = 'SEND MESSAGE',
    submitButtonColor = '#8B4513',
    successMessage = 'Thank you! Your message has been sent successfully.',
    errorMessage = 'Oops! Something went wrong. Please try again.',
    showTermsCheckbox = true,
    termsText = 'I accept the terms & conditions and I understand that my data will be hold securely in accordance with the privacy policy.',
    blocks = [],
    viewMode = null,
  } = settings;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Responsive layout detection based on viewMode (preview) or CSS (production)
  const showMobileLayout = viewMode === 'mobile';
  const showTabletLayout = viewMode === 'tablet';
  const showDesktopLayout = viewMode === 'desktop';

  // Default blocks for preview
  const defaultBlocks = [
    { id: 'field_1', type: 'form_field', settings: { name: 'name', type: 'text', placeholder: 'Your full name', required: true } },
    { id: 'field_2', type: 'form_field', settings: { name: 'email', type: 'email', placeholder: 'Your email address', required: true } },
    { id: 'field_3', type: 'form_field', settings: { name: 'phone', type: 'tel', placeholder: 'Your mobile number', required: false } },
    { id: 'field_4', type: 'form_field', settings: { name: 'message', type: 'textarea', placeholder: 'Your message here...', required: true, rows: 8 } },
  ];

  const displayBlocks = blocks.length > 0 ? blocks : defaultBlocks;

  // Separate textarea fields from other fields
  const textareaFields = displayBlocks.filter((field) => field.settings.type === 'textarea');
  const otherFields = displayBlocks.filter((field) => field.settings.type !== 'textarea');

  // Responsive classes with viewMode support
  const sectionPaddingClass = viewMode
    ? showMobileLayout
      ? 'py-12'
      : showTabletLayout
      ? 'py-16'
      : 'py-20'
    : 'py-12 md:py-16 lg:py-20';

  const containerPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4'
      : showTabletLayout
      ? 'px-4'
      : 'px-4 2xl:px-0'
    : 'px-4 2xl:px-0';

  const titleMarginClass = viewMode
    ? showMobileLayout
      ? 'mb-10'
      : 'mb-14'
    : 'mb-10 md:mb-14';

  const titleSizeClass = viewMode
    ? titleStyle === 'script'
      ? showMobileLayout
        ? 'text-3xl'
        : 'text-4xl'
      : showMobileLayout
        ? 'text-2xl'
        : showTabletLayout
          ? 'text-3xl'
          : 'text-4xl'
    : titleStyle === 'script'
      ? 'text-3xl md:text-4xl'
      : 'text-2xl md:text-3xl lg:text-4xl';

  const gridColsClass = viewMode
    ? showMobileLayout
      ? 'grid-cols-1'
      : 'grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2';

  const gridGapClass = viewMode
    ? showMobileLayout
      ? 'gap-6'
      : 'gap-8'
    : 'gap-6 md:gap-8';

  const inputPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4 py-3.5'
      : 'px-5 py-4'
    : 'px-4 py-3.5 md:px-5 md:py-4';

  const inputTextClass = viewMode
    ? showMobileLayout
      ? 'text-sm'
      : 'text-sm'
    : 'text-sm';

  const textareaPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4 py-3.5'
      : 'px-5 py-4'
    : 'px-4 py-3.5 md:px-5 md:py-4';

  const successIconClass = viewMode
    ? showMobileLayout
      ? 'w-14 h-14'
      : 'w-16 h-16'
    : 'w-14 h-14 md:w-16 md:h-16';

  const successTitleClass = viewMode
    ? showMobileLayout
      ? 'text-lg'
      : 'text-xl'
    : 'text-lg md:text-xl';

  const buttonPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-6 py-3'
      : 'px-8 py-3.5'
    : 'px-6 py-3 md:px-8 md:py-3.5';

  const buttonTextClass = viewMode
    ? showMobileLayout
      ? 'text-xs'
      : 'text-sm'
    : 'text-xs md:text-sm';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setFormData({});
      setTermsAccepted(false);
    }, 1500);
  };

  return (
    <section className={sectionPaddingClass} style={{ backgroundColor }}>
      <div className={`container mx-auto ${containerPaddingClass}`}>
        {/* Title */}
        {title && (
          <h2
            className={`text-center ${titleMarginClass} ${
              titleStyle === 'script' ? 'font-serif italic' : 'font-bold'
            } ${titleSizeClass}`}
            style={{ color: textColor }}
          >
            {title}
          </h2>
        )}

        {/* Form */}
        {status === 'success' ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className={`${successIconClass} rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center`}>
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`${successTitleClass} font-bold mb-2`} style={{ color: textColor }}>
              Message Sent!
            </h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button
              onClick={() => setStatus('idle')}
              className={`${buttonPaddingClass} ${buttonTextClass} rounded-lg font-medium text-white transition-opacity hover:opacity-90`}
              style={{ backgroundColor: submitButtonColor }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className={`grid ${gridColsClass} ${gridGapClass}`}>
              {/* Left Column - Text/Email/Tel Fields */}
              <div className="space-y-4">
                {otherFields.map((field) => (
                  <div key={field.id}>
                    <input
                      id={field.settings.name}
                      name={field.settings.name}
                      type={field.settings.type || 'text'}
                      placeholder={field.settings.placeholder}
                      required={field.settings.required}
                      value={formData[field.settings.name || ''] || ''}
                      onChange={handleChange}
                      className={`w-full ${inputPaddingClass} border border-gray-300 bg-white focus:outline-none focus:border-gray-500 transition-colors ${inputTextClass}`}
                      style={{ color: textColor }}
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
                      className="mt-1 w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-500 leading-relaxed">
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
                    value={formData[field.settings.name || ''] || ''}
                    onChange={handleChange}
                    className={`w-full h-full min-h-[200px] ${textareaPaddingClass} border border-gray-300 bg-white focus:outline-none focus:border-gray-500 transition-colors ${inputTextClass} resize-none`}
                    style={{ color: textColor }}
                  />
                ))}

                {/* Submit Button - Below Textarea on Right */}
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={status === 'loading' || (showTermsCheckbox && !termsAccepted)}
                    className={`${buttonPaddingClass} text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wider ${buttonTextClass}`}
                    style={{ backgroundColor: submitButtonColor }}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>{submitButtonText}</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 flex items-center gap-2 max-w-5xl mx-auto">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm2;
