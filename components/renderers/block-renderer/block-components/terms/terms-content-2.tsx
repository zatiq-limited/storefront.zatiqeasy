"use client";

import { useState, useEffect } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContentSection {
  title: string;
  content: string;
}

interface TermsContent2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  contentSections?: string; // JSON string of content sections
}

interface TermsContent2Props {
  settings?: TermsContent2Settings;
}

export default function TermsContent2({
  settings = {},
}: TermsContent2Props) {
  const s = convertSettingsKeys(
    settings as Record<string, unknown>
  ) as TermsContent2Settings;
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );

  useEffect(() => {
    try {
      const sections = s.contentSections ? JSON.parse(s.contentSections) : [];
      setContentSections(
        sections.filter(
          (section: ContentSection) => section.title && section.title.trim()
        )
      );
    } catch (error) {
      console.error("Error parsing content sections:", error);
      setContentSections([]);
    }
  }, [s.contentSections]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (contentSections.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#FFFFFF" }}
    >
      <div className="container px-4 2xl:px-0">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {contentSections.map((section, index) => {
              const isExpanded = expandedSections.has(index);

              return (
                <div
                  key={index}
                  className="border rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    borderColor: isExpanded
                      ? s.accentColor || "#2563EB"
                      : "#e5e7eb",
                    boxShadow: isExpanded
                      ? `0 0 0 1px ${s.accentColor || "#2563EB"}20`
                      : "none",
                  }}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors"
                    style={{
                      backgroundColor: isExpanded
                        ? (s.accentColor || "#2563EB") + "08"
                        : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: isExpanded
                            ? s.accentColor || "#2563EB"
                            : (s.textColor || "#111827") + "15",
                          color: isExpanded
                            ? "#FFFFFF"
                            : s.textColor || "#111827",
                        }}
                      >
                        {index + 1}
                      </span>
                      <h3
                        className="text-lg font-semibold"
                        style={{
                          color: isExpanded
                            ? s.accentColor || "#2563EB"
                            : s.textColor || "#111827",
                        }}
                      >
                        {section.title}
                      </h3>
                    </div>
                    <div
                      className="flex-shrink-0 ml-4"
                      style={{ color: s.textColor || "#111827" }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      className="px-6 pb-6 pt-2"
                      style={{ color: (s.textColor || "#111827") + "CC" }}
                    >
                      <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand/Collapse All Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (expandedSections.size === contentSections.length) {
                  setExpandedSections(new Set());
                } else {
                  setExpandedSections(
                    new Set(contentSections.map((_, i) => i))
                  );
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: (s.accentColor || "#2563EB") + "15",
                color: s.accentColor || "#2563EB",
              }}
            >
              {expandedSections.size === contentSections.length
                ? "Collapse All Sections"
                : "Expand All Sections"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
