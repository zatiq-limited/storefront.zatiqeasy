import React from 'react';

interface PaymentStatus2Settings {
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

interface PaymentStatus2Props {
  settings?: PaymentStatus2Settings;
}

const PaymentStatus2: React.FC<PaymentStatus2Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    accentColor = "#2563EB",
    title = "Yes, you've successfully ordered!",
    subtitle = "Your payment has been processed successfully, and your order has been placed.",
    orderNumber = "#ASK123456",
    phoneNumber = "+880178289696",
    buttonText = "Continue Shopping",
    buttonColor = "#2D6FEE",
    buttonLink = "/",
  } = settings;

  return (
    <section className="w-full py-8 md:py-14" style={{ backgroundColor }}>
      <div className="max-w-[562px] mx-auto px-4">
        <div className="bg-white rounded-2xl px-6 py-8 md:px-8 md:py-12 text-center border border-gray-100 shadow-sm">
          {/* Payment Terminal Icon */}
          <div className="flex justify-center mb-6">
            <svg
              width="120"
              height="160"
              viewBox="0 0 120 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-[110px]"
            >
              {/* Terminal Body */}
              <rect x="20" y="20" width="80" height="120" rx="4" fill="#3B3B3B" />

              {/* Screen */}
              <rect x="30" y="30" width="60" height="35" rx="2" fill="#E5E5E5" />

              {/* Keypad buttons */}
              <rect x="30" y="75" width="15" height="8" rx="1" fill="#5A5A5A" />
              <rect x="52.5" y="75" width="15" height="8" rx="1" fill="#5A5A5A" />
              <rect x="75" y="75" width="15" height="8" rx="1" fill="#5A5A5A" />

              <rect x="30" y="88" width="15" height="8" rx="1" fill="#5A5A5A" />
              <rect x="52.5" y="88" width="15" height="8" rx="1" fill="#5A5A5A" />
              <rect x="75" y="88" width="15" height="8" rx="1" fill="#5A5A5A" />

              <rect x="30" y="101" width="15" height="8" rx="1" fill="#5A5A5A" />
              <rect x="52.5" y="101" width="15" height="8" rx="1" fill="#5A5A5A" />
              <rect x="75" y="101" width="15" height="8" rx="1" fill="#5A5A5A" />

              {/* Colored action buttons */}
              <rect x="30" y="114" width="15" height="8" rx="1" fill="#EF4444" />
              <rect x="52.5" y="114" width="15" height="8" rx="1" fill="#FBBF24" />
              <rect x="75" y="114" width="15" height="8" rx="1" fill="#10B981" />

              {/* Card being inserted */}
              <rect x="35" y="140" width="50" height="30" rx="2" fill={accentColor} />
              <rect x="40" y="145" width="8" height="6" rx="1" fill="#FCD34D" />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="font-medium text-xl leading-7 mb-3"
            style={{ color: textColor }}
          >
            {title}
          </h1>

          {/* Message */}
          <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-[490px] mx-auto">
            {subtitle}
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

          {/* Continue Button */}
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

export default PaymentStatus2;
