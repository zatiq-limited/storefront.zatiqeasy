import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface CheckoutHero3Props {
  title?: string;
  showBreadcrumb?: boolean;
}

const CheckoutHero3: React.FC<CheckoutHero3Props> = ({
  title = "Checkout",
  showBreadcrumb = true,
}) => {
  return (
    <section className="py-1 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-2 2xl:px-0">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav className="flex items-center gap-2 text-sm mb-4">
            <a
              href="/"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <a
              href="/cart"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cart
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default CheckoutHero3;
