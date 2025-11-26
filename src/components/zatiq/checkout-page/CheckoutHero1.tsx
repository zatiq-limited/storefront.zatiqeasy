import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface Step {
  id: number;
  name: string;
  icon: string;
}

interface CheckoutHero1Props {
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
  showSteps?: boolean;
  currentStep?: number;
  steps?: Step[];
  backgroundGradient?: string;
}

const CheckoutHero1: React.FC<CheckoutHero1Props> = ({
  title = "Checkout",
  subtitle = "Complete your order",
  showBreadcrumb = true,
  showSteps = true,
  currentStep = 2,
  steps = [],
  backgroundGradient = "from-violet-50 via-purple-50 to-blue-50",
}) => {
  const getStepIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      "shopping-cart": (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      "credit-card": (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      "check-circle": (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[iconName] || icons["check-circle"];
  };

  return (
    <section className={`py-8 md:py-12 bg-linear-to-r ${backgroundGradient}`}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav className="flex items-center gap-2 text-sm mb-6">
            <a href="/" className="flex items-center gap-1 text-violet-600 hover:text-violet-800 transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <a href="/cart" className="text-violet-600 hover:text-violet-800 transition-colors">
              Cart
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 font-medium">{title}</span>
          </nav>
        )}

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        {showSteps && steps.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Progress Bar Background */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-linear-to-r from-violet-500 to-purple-600 -z-10 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isUpcoming = step.id > currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    {/* Step Icon */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2
                        ${isCompleted ? "bg-linear-to-br from-violet-500 to-purple-600 border-violet-500 text-white shadow-lg shadow-violet-500/30" : ""}
                        ${isCurrent ? "bg-white border-violet-500 text-violet-600 shadow-lg shadow-violet-500/20 scale-110" : ""}
                        ${isUpcoming ? "bg-white border-gray-300 text-gray-400" : ""}
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        getStepIcon(step.icon)
                      )}
                    </div>

                    {/* Step Name */}
                    <span
                      className={`
                        text-xs sm:text-sm font-medium text-center transition-colors
                        ${isCompleted || isCurrent ? "text-violet-700" : "text-gray-500"}
                      `}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutHero1;
