import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface Step {
  id: number;
  name: string;
  icon: string;
}

interface CheckoutHero2Props {
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
  showSteps?: boolean;
  currentStep?: number;
  steps?: Step[];
  backgroundGradient?: string;
}

const CheckoutHero2: React.FC<CheckoutHero2Props> = ({
  title = "Checkout",
  subtitle = "Complete your order",
  showBreadcrumb = true,
  showSteps = true,
  currentStep = 2,
  steps = [],
  backgroundGradient = "from-blue-50 via-indigo-50 to-purple-50",
}) => {
  const getStepIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      "shopping-cart": (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      "credit-card": (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      "check-circle": (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
    return icons[iconName] || icons["check-circle"];
  };

  return (
    <section
      className={`py-6 border-b border-gray-200 bg-linear-to-r ${backgroundGradient}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left - Title & Breadcrumb */}
          <div className="flex-1">
            {showBreadcrumb && (
              <nav className="flex items-center gap-2 text-xs mb-2">
                <a
                  href="/"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Home</span>
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-600 font-medium">{title}</span>
              </nav>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right - Compact Progress Steps */}
          {showSteps && steps.length > 0 && (
            <div className="flex items-center gap-2">
              {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isUpcoming = step.id > currentStep;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Card */}
                    <div
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                        ${isCompleted ? "bg-green-50 border-green-200" : ""}
                        ${
                          isCurrent
                            ? "bg-blue-50 border-blue-300 shadow-md"
                            : ""
                        }
                        ${isUpcoming ? "bg-gray-50 border-gray-200" : ""}
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`
                          w-7 h-7 rounded-full flex items-center justify-center transition-all
                          ${isCompleted ? "bg-green-500 text-white" : ""}
                          ${isCurrent ? "bg-blue-500 text-white" : ""}
                          ${isUpcoming ? "bg-gray-300 text-gray-600" : ""}
                        `}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          getStepIcon(step.icon)
                        )}
                      </div>

                      {/* Step Name - Hidden on mobile */}
                      <span
                        className={`
                          hidden sm:inline text-xs font-semibold transition-colors
                          ${isCompleted ? "text-green-700" : ""}
                          ${isCurrent ? "text-blue-700" : ""}
                          ${isUpcoming ? "text-gray-500" : ""}
                        `}
                      >
                        {step.name}
                      </span>
                    </div>

                    {/* Arrow between steps */}
                    {index < steps.length - 1 && (
                      <ChevronRight
                        className={`
                          w-4 h-4 hidden md:block
                          ${
                            step.id < currentStep
                              ? "text-green-500"
                              : "text-gray-400"
                          }
                        `}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckoutHero2;
