import React from 'react';

interface PaymentStatus1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
  orderNumber?: string;
  phoneNumber?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonLink?: string;
}

interface PaymentStatus1Props {
  settings?: PaymentStatus1Settings;
}

const PaymentStatus1: React.FC<PaymentStatus1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    accentColor = "#12B76A",
    title = "Yes, you've successfully ordered!",
    subtitle = "Your payment has been processed successfully, and your order has been placed. A shipping confirmation email will be sent to you as soon as your order is dispatched.",
    orderNumber = "#ASK123456",
    phoneNumber = "+880178289696",
    buttonText = "Back to shop",
    buttonColor = "#2D6FEE",
    buttonLink = "/",
  } = settings;

  return (
    <section className="w-full py-8 md:py-14" style={{ backgroundColor }}>
      <div className="max-w-[562px] mx-auto px-4">
        <div className="bg-white rounded-2xl px-6 py-8 md:px-8 md:py-12 text-center border border-gray-100 shadow-sm">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="60" fill={`${accentColor}20`} />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M85.482 36.95L49.682 71.5L40.182 61.35C38.432 59.7 35.682 59.6 33.682 61C31.732 62.45 31.182 65 32.382 67.05L43.632 85.35C44.732 87.05 46.632 88.1 48.782 88.1C50.832 88.1 52.782 87.05 53.882 85.35C55.682 83 90.032 42.05 90.032 42.05C94.532 37.45 89.082 33.4 85.482 36.9V36.95Z"
                  fill={accentColor}
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1
            className="font-medium text-xl leading-7 mb-2"
            style={{ color: textColor }}
          >
            {title}
          </h1>

          {/* Message */}
          <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-[490px] mx-auto">
            {subtitle.replace("{orderNumber}", "")}
            {orderNumber && (
              <>
                {" "}Order{" "}
                <span className="font-semibold" style={{ color: textColor }}>{orderNumber}</span>
              </>
            )}
          </p>

          {/* Contact Section */}
          <div className="mb-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">
              Have any Questions/Suggestions?
            </p>
            <p className="text-sm font-medium" style={{ color: textColor }}>
              {phoneNumber}
            </p>
          </div>

          {/* Back to Shop Button */}
          <a
            href={buttonLink}
            className="w-full max-w-[400px] h-12 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center mx-auto hover:opacity-90"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default PaymentStatus1;
