"use client";

import { useState, useEffect } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";

interface ContentSection {
  title: string;
  content: string;
}

interface PrivacyContent1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  contentSections?: string; // JSON string of content sections
}

interface PrivacyContent1Props {
  settings?: PrivacyContent1Settings;
}

export default function PrivacyContent1({
  settings = {},
}: PrivacyContent1Props) {
  const s = convertSettingsKeys(
    settings as Record<string, unknown>
  ) as PrivacyContent1Settings;
  const [activeSection, setActiveSection] = useState<string>("");
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    try {
      const sections = s.contentSections ? JSON.parse(s.contentSections) : [];
      setContentSections(
        sections.filter(
          (section: ContentSection) => section.title && section.title.trim()
        )
      );

      // Set first section as active
      if (sections.length > 0 && sections[0].title) {
        setActiveSection(sections[0].title);
      }
    } catch (error) {
      console.error("Error parsing content sections:", error);
      setContentSections([]);
    }
  }, [s.contentSections]);

  const handleSectionClick = (title: string) => {
    setActiveSection(title);
    const element = document.getElementById(
      title.replace(/\s+/g, "-").toLowerCase()
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Table of Contents - Sidebar */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="lg:block">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: s.textColor || "#111827" }}
              >
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {contentSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => handleSectionClick(section.title)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === section.title
                        ? "shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor:
                        activeSection === section.title
                          ? (s.accentColor || "#2563EB") + "15"
                          : "transparent",
                      color:
                        activeSection === section.title
                          ? s.accentColor || "#2563EB"
                          : s.textColor || "#111827",
                      borderLeft:
                        activeSection === section.title
                          ? `3px solid ${s.accentColor || "#2563EB"}`
                          : "3px solid transparent",
                    }}
                  >
                    <span className="flex items-center">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mr-3"
                        style={{
                          backgroundColor:
                            activeSection === section.title
                              ? s.accentColor || "#2563EB"
                              : (s.textColor || "#111827") + "20",
                          color:
                            activeSection === section.title
                              ? "#FFFFFF"
                              : s.textColor || "#111827",
                        }}
                      >
                        {index + 1}
                      </span>
                      {section.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content - Main */}
          <div className="max-w-none">
            <div className="prose prose-lg max-w-none">
              {contentSections.map((section, index) => (
                <div
                  key={index}
                  id={section.title.replace(/\s+/g, "-").toLowerCase()}
                  className="mb-12 scroll-mt-24"
                  style={{ color: s.textColor || "#111827" }}
                >
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-6 flex items-center"
                    style={{ color: s.textColor || "#111827" }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-4"
                      style={{
                        backgroundColor: (s.accentColor || "#2563EB") + "20",
                        color: s.accentColor || "#2563EB",
                      }}
                    >
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div
                    className="text-base leading-relaxed space-y-4"
                    style={{ color: (s.textColor || "#111827") + "CC" }}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
