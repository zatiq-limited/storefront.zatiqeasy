import React from 'react';
import { Check } from 'lucide-react';

// Component-specific types
interface PaymentStatusProps {
  orderNumber?: string;
  phoneNumber?: string;
}

const PaymentStatus1: React.FC<PaymentStatusProps> = ({
  orderNumber = '#ASK123456',
  phoneNumber = '+880178289696',
}) => {
  return (
    <div className="w-full max-w-[562px] mx-auto">
      <div className="bg-white rounded-2xl px-6 py-8 md:px-8 md:py-12 text-center border border-gray-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[120px] h-[120px] rounded-full bg-[#C8F4E3] flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="120" height="120" rx="60" fill="#D1FADF" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M85.482 36.95L49.682 71.5L40.182 61.35C38.432 59.7 35.682 59.6 33.682 61C31.732 62.45 31.182 65 32.382 67.05L43.632 85.35C44.732 87.05 46.632 88.1 48.782 88.1C50.832 88.1 52.782 87.05 53.882 85.35C55.682 83 90.032 42.05 90.032 42.05C94.532 37.45 89.082 33.4 85.482 36.9V36.95Z" fill="#12B76A" />
            </svg>

          </div>
        </div>

        {/* Title */}
        <h1 className="font-inter font-medium text-[20px] leading-7 tracking-[0%] text-center text-gray-900] mb-2">
          Yes, you've successfully ordered!
        </h1>

        {/* Message */}
        <p className="font-inter font-normal text-[14px] leading-[160%] tracking-[0%] text-center text-[#9CA3AF] mb-6 max-w-[490px] mx-auto">
          Your payment has been processed successfully, and your order{' '}
          <span className="font-semibold text-gray-900">{orderNumber}</span>{' '}
          has been placed. A shipping confirmation email will be sent to you as soon as your order is dispatched.
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

        {/* Back to Shop Button */}
        <button className="w-full max-w-[530px] h-[52px] bg-[#2D6FEE] hover:bg-[#2563EB] text-white font-inter font-bold text-[16px] leading-6 tracking-[0%] text-center rounded-lg transition-colors flex items-center justify-center mx-auto">
          Back to shop
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus1;
