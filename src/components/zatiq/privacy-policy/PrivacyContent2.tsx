import React, { useState } from "react";
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

interface ContentBlock {
  id: string;
  type: string;
  settings: {
    title?: string;
    content?: string;
    icon?: string;
  };
}

interface PrivacyContent2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  expandAllByDefault?: boolean;
}

interface PrivacyContent2Props {
  settings?: PrivacyContent2Settings;
  blocks?: ContentBlock[];
}

// Get icon based on section title
const getIconForSection = (title: string): React.ReactNode => {
  const lowerTitle = title.toLowerCase();
  const iconClass = "w-5 h-5";

  if (lowerTitle.includes("collect")) return <Archive className={iconClass} />;
  if (lowerTitle.includes("use") || lowerTitle.includes("how")) return <ClipboardCheck className={iconClass} />;
  if (lowerTitle.includes("shar") || lowerTitle.includes("disclos")) return <Share2 className={iconClass} />;
  if (lowerTitle.includes("secur")) return <Lock className={iconClass} />;
  if (lowerTitle.includes("cookie") || lowerTitle.includes("track")) return <Globe className={iconClass} />;
  if (lowerTitle.includes("right") || lowerTitle.includes("choice")) return <ShieldCheck className={iconClass} />;
  if (lowerTitle.includes("child")) return <Users className={iconClass} />;
  if (lowerTitle.includes("change") || lowerTitle.includes("update")) return <RefreshCw className={iconClass} />;
  if (lowerTitle.includes("contact")) return <Mail className={iconClass} />;
  return <FileText className={iconClass} />;
};

const PrivacyContent2: React.FC<PrivacyContent2Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    accentColor = "#2563EB",
    expandAllByDefault = false,
  } = settings;

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    expandAllByDefault ? new Set(blocks.map((b) => b.id)) : new Set([blocks[0]?.id])
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(blocks.map((b) => b.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <section className="py-6 md:py-8 lg:py-12" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">
            {blocks.length} sections
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={expandAll}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: accentColor }}
            >
              Expand all
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: accentColor }}
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const isExpanded = expandedSections.has(block.id);

            return (
              <div
                key={block.id}
                className={`bg-white rounded-xl border transition-all duration-200 ${
                  isExpanded ? "border-gray-200 shadow-sm" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(block.id)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                    style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
                  >
                    {getIconForSection(block.settings.title || "")}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base md:text-lg font-semibold"
                      style={{ color: textColor }}
                    >
                      {block.settings.title}
                    </h3>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <div
                    className={`shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 md:px-6 pb-6 pl-[76px] md:pl-[88px]">
                    <div
                      className="prose prose-gray max-w-none [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-gray-600 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-gray-600 [&_li]:text-gray-600 [&_a]:text-blue-600 [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: block.settings.content || "" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Questions about our privacy practices?{" "}
              <a
                href="/contact"
                className="font-medium underline transition-colors"
                style={{ color: accentColor }}
              >
                Contact us
              </a>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: accentColor }}
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyContent2;
