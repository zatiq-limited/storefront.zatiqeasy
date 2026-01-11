"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-6 sm:p-8 md:p-12 lg:p-16">
            {/* 404 Illustration */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="relative">
                <div className="text-center">
                  {/* Animated 404 Number */}
                  <div className="relative inline-block">
                    <h1 className="text-8xl sm:text-9xl md:text-[180px] lg:text-[220px] font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 leading-none tracking-tight">
                      404
                    </h1>
                    {/* Glow effect */}
                    <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[180px] lg:text-[220px] font-black text-blue-600/10 blur-2xl">
                      404
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <div className="h-0.5 w-12 sm:w-16 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="h-0.5 w-12 sm:w-16 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Page Not Found
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
                The page might have been moved, deleted, or the URL might be
                incorrect.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <button
                onClick={() => router.back()}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 sm:py-4 overflow-hidden font-semibold text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full hover:text-white hover:shadow-lg active:scale-95"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">
                  Go Back
                </span>
                <span className="relative invisible">Go Back</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 sm:py-4 overflow-hidden font-semibold text-white transition duration-300 ease-out bg-linear-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
              >
                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-indigo-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                  Back to Home
                </span>
              </Link>
            </div>

            {/* Footer CTA */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Want to create your own e-commerce store?
                </p>
                <Link
                  href="https://zatiqeasy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 group"
                >
                  <span>Visit zatiqeasy.com</span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
