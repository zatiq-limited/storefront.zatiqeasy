import React from 'react';

// Component-specific types
interface PaymentStatusProps {
  orderNumber?: string;
  phoneNumber?: string;
}

const PaymentStatus2: React.FC<PaymentStatusProps> = ({
  orderNumber = '#ASK123456',
  phoneNumber = '+880178289696',
}) => {
  return (
    <div className="w-full max-w-[562px] mx-auto">
      <div className="bg-white rounded-2xl px-6 py-8 md:px-8 md:py-12 text-center border border-gray-100">
        {/* Payment Terminal Icon */}
        <div className="flex justify-center mb-8">
          <svg
            width="120"
            height="180"
            viewBox="0 0 120 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[80px] h-[120px] md:w-[100px] md:h-[150px]"
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
            <rect x="35" y="140" width="50" height="30" rx="2" fill="#2563EB" />
            <rect x="40" y="145" width="8" height="6" rx="1" fill="#FCD34D" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-inter font-medium text-[20px] leading-7 tracking-[0%] text-center text-gray-900 mb-[18px]">
          Yes, you've successfully ordered!
        </h1>

        {/* Message */}
        <p className="text-[15px] md:text-[16px] leading-6 text-gray-500 mb-6 max-w-[490px] mx-auto">
          Your payment has been processed successfully, and your order{' '}
          <span className="font-semibold text-gray-900">{orderNumber}</span>{' '}
          has been placed.
        </p>
        {/* Contact Section */}
        <div className="mb-6">
          <p className="text-[15px] md:text-[16px] leading-6 text-gray-500 mb-1">
            Have any Questions/Suggestions?
          </p>
          <p className="text-[15px] md:text-[16px] leading-6 font-medium text-gray-900">
            {phoneNumber}
          </p>
        </div>

        {/* Continue Button */}
        <button className="w-full bg-[#2D6FEE] hover:bg-[#2563EB] text-white text-[16px] font-medium leading-6 py-4 px-6 rounded-lg transition-colors">
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus2;
