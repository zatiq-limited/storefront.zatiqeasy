import React from "react";

interface ContentBlock {
  id: string;
  type: string;
  settings: {
    title?: string;
    content?: string;
  };
}

interface PrivacyContent1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

interface PrivacyContent1Props {
  settings?: PrivacyContent1Settings;
  blocks?: ContentBlock[];
}

const PrivacyContent1: React.FC<PrivacyContent1Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    accentColor = "#2563EB",
  } = settings;

  return (
    <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: accentColor }}
              >
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {blocks.map((block, index) => (
                  <a
                    key={block.id}
                    href={`#section-${index}`}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1 border-l-2 border-transparent hover:border-blue-500 pl-3 -ml-px"
                  >
                    {block.settings.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            {/* Mobile Table of Contents - Sticky */}
            <div className="lg:hidden sticky top-0 z-30 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-100">
              <details className="group">
                <summary className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: accentColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Table of Contents</p>
                    <p className="text-xs text-gray-500">{blocks.length} sections</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <nav className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {blocks.map((block, index) => (
                  <a
                    key={block.id}
                    href={`#section-${index}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium text-white shrink-0"
                      style={{ backgroundColor: accentColor }}
                    >
                      {index + 1}
                    </span>
                    <span className="line-clamp-1">{block.settings.title}</span>
                  </a>
                ))}
              </nav>
              </details>
            </div>

            {/* Content Sections */}
            <div className="space-y-10 md:space-y-12">
              {blocks.map((block, index) => (
                <article
                  key={block.id}
                  id={`section-${index}`}
                  className="scroll-mt-24"
                >
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3"
                    style={{ color: textColor }}
                  >
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {index + 1}
                    </span>
                    {block.settings.title}
                  </h2>
                  <div
                    className="prose prose-gray max-w-none pl-11 [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-gray-600 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-gray-600 [&_li]:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: block.settings.content || "" }}
                  />
                </article>
              ))}
            </div>

            {/* Back to Top Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: accentColor }}
              >
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
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyContent1;
