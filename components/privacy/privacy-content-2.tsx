"use client";

import { useState, useEffect } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";
import {
  Archive,
  ClipboardCheck,
  Share2,
  Lock,
  Globe,
  ShieldCheck,
  Users,
  RefreshCw,
  Mail,
  FileText,
  ChevronDown,
  ArrowUp,
} from "lucide-react";

interface ContentSection {
  title: string;
  content: string;
}

interface PrivacyContent2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  expandAllByDefault?: boolean;
  contentSections?: string; // JSON string of content sections
}

interface PrivacyContent2Props {
  settings?: PrivacyContent2Settings;
}

// Get icon based on section title
const getIconForSection = (title: string) => {
  const lowerTitle = title.toLowerCase();
  const iconClass = 'w-5 h-5';

  if (lowerTitle.includes('collect')) return <Archive className={iconClass} />;
  if (lowerTitle.includes('use') || lowerTitle.includes('how')) return <ClipboardCheck className={iconClass} />;
  if (lowerTitle.includes('shar') || lowerTitle.includes('disclos')) return <Share2 className={iconClass} />;
  if (lowerTitle.includes('secur')) return <Lock className={iconClass} />;
  if (lowerTitle.includes('cookie') || lowerTitle.includes('track')) return <Globe className={iconClass} />;
  if (lowerTitle.includes('right') || lowerTitle.includes('choice')) return <ShieldCheck className={iconClass} />;
  if (lowerTitle.includes('child')) return <Users className={iconClass} />;
  if (lowerTitle.includes('change') || lowerTitle.includes('update')) return <RefreshCw className={iconClass} />;
  if (lowerTitle.includes('contact')) return <Mail className={iconClass} />;
  return <FileText className={iconClass} />;
};

export default function PrivacyContent2({ settings = {} }: PrivacyContent2Props) {
  const s = convertSettingsKeys(settings as Record<string, unknown>) as PrivacyContent2Settings;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    try {
      const sections = s.contentSections ? JSON.parse(s.contentSections) : [];
      const filteredSections = sections.filter((section: ContentSection) => section.title && section.title.trim());
      setContentSections(filteredSections);

      // Expand sections based on default setting
      if (s.expandAllByDefault) {
        setExpandedSections(new Set(filteredSections.map((section: ContentSection) => section.title)));
      } else {
        // Expand first section by default
        if (filteredSections.length > 0 && filteredSections[0].title) {
          setExpandedSections(new Set([filteredSections[0].title]));
        }
      }
    } catch (error) {
      console.error("Error parsing content sections:", error);
      setContentSections([]);
    }
  }, [s.contentSections, s.expandAllByDefault]);

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const toggleAllSections = () => {
    if (expandedSections.size === contentSections.length) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set(contentSections.map(section => section.title)));
    }
  };

  if (contentSections.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#F9FAFB" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header with Toggle All Button */}
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: s.textColor || "#111827" }}
          >
            Privacy Policy Details
          </h2>
          <button
            onClick={toggleAllSections}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
            style={{
              color: s.accentColor || "#2563EB",
              borderColor: (s.accentColor || "#2563EB") + "40",
              backgroundColor: (s.accentColor || "#2563EB") + "10",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = (s.accentColor || "#2563EB") + "20";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = (s.accentColor || "#2563EB") + "10";
            }}
          >
            {expandedSections.size === contentSections.length ? (
              <>
                <ArrowUp className="w-4 h-4" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand All
              </>
            )}
          </button>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {contentSections.map((section, index) => {
            const isExpanded = expandedSections.has(section.title);

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200"
                style={{
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg"
                      style={{
                        backgroundColor: (s.accentColor || "#2563EB") + "15",
                        color: s.accentColor || "#2563EB",
                      }}
                    >
                      {getIconForSection(section.title)}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: s.textColor || "#111827" }}
                    >
                      {section.title}
                    </h3>
                  </div>

                  {/* Chevron Icon */}
                  <div
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ color: (s.textColor || "#111827") + "60" }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Content */}
                {isExpanded && (
                  <div
                    className="px-6 pb-6 border-t"
                    style={{ borderColor: "#F3F4F6" }}
                  >
                    <div
                      className="pt-4 text-base leading-relaxed"
                      style={{ color: (s.textColor || "#111827") + "CC" }}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}