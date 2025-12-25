"use client";

import React from "react";
import type { FeatureInterface } from "@/types/landing-page.types";

interface NirvanaFeaturesProps {
  content: FeatureInterface | null | undefined;
}

export function NirvanaFeatures({ content }: NirvanaFeaturesProps) {
  if (!content || !content.content?.length) {
    return null;
  }

  return (
    <div className="relative min-h-fit py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Title Section */}
      {content.title && (
        <div className="relative mb-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="md:pb-2 text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-landing-primary to-landing-secondary leading-tight tracking-tight">
              {content.title}
            </h2>
            <div className="mt-6 w-24 h-1 mx-auto bg-gradient-to-r from-landing-primary to-landing-secondary rounded-full" />
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12 px-4 cursor-pointer">
          {content.content.map((item, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white rounded-2xl shadow-[0_0_50px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_50px_0_rgba(0,0,0,0.15)] transition-all duration-500 ease-out hover:translate-y-[-4px]"
            >
              {/* Feature number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-landing-primary to-landing-secondary rounded-2xl rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="relative pl-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-landing-primary group-hover:to-landing-secondary transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
            </div>
          ))}
        </div>
      </div>

      {/* Background accents */}
      <div className="absolute top-40 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
    </div>
  );
}

export default NirvanaFeatures;
