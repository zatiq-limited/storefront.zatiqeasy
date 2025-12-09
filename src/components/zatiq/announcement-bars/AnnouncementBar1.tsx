import React from "react";

// Block from theme.json (content data)
interface AnnouncementBlock {
  wrapper?: string;
  type?: string;
  id?: string;
  message?: string;
  icon_left?: string;
  icon_right?: string;
  gradient_start?: string;
  gradient_end?: string;
  text_color?: string;
  link?: string;
  link_text?: string;
}

// Settings from theme.json (behavior settings only)
interface AnnouncementBar1Settings {
  dismissible?: boolean;
  sticky?: boolean;
}

interface AnnouncementBar1Props {
  // Direct props (legacy format)
  message?: string;
  icon_left?: string;
  icon_right?: string;
  gradient_start?: string;
  gradient_end?: string;
  text_color?: string;
  dismissible?: boolean;
  sticky?: boolean;
  fontFamily?: string;
  // New props from theme.json
  settings?: AnnouncementBar1Settings;
  blocks?: AnnouncementBlock[];
}

const AnnouncementBar1: React.FC<AnnouncementBar1Props> = ({
  message: messageProp,
  icon_left: iconLeftProp,
  icon_right: iconRightProp,
  gradient_start: gradientStartProp,
  gradient_end: gradientEndProp,
  text_color: textColorProp,
  dismissible: dismissibleProp,
  sticky: stickyProp,
  fontFamily,
  settings = {},
  blocks = [],
}) => {
  // Get content from blocks (first block) or fallback to direct props
  const contentBlock = blocks[0] || {};

  // Content from blocks takes priority, then direct props
  const message = messageProp ?? contentBlock.message;
  const iconLeft = iconLeftProp ?? contentBlock.icon_left;
  const iconRight = iconRightProp ?? contentBlock.icon_right;
  const gradientStart = gradientStartProp ?? contentBlock.gradient_start ?? "#FF6B6B";
  const gradientEnd = gradientEndProp ?? contentBlock.gradient_end ?? "#4ECDC4";
  const textColor = textColorProp ?? contentBlock.text_color ?? "#FFFFFF";
  const link = contentBlock.link;
  const linkText = contentBlock.link_text || "Learn More";

  // Behavior settings from settings object or direct props
  const dismissible = dismissibleProp ?? settings.dismissible ?? false;
  const isSticky = stickyProp ?? settings.sticky ?? false;

  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  // Render message with optional link
  const renderMessage = () => {
    if (link) {
      return (
        <a href={link} className="hover:underline">
          {message} {linkText && <span className="underline">{linkText}</span>}
        </a>
      );
    }
    return <span>{message}</span>;
  };

  return (
    <div
      className={`min-h-8 sm:min-h-10 lg:min-h-14 flex items-center justify-center text-center text-xs sm:text-sm font-bold ${
        isSticky ? "sticky top-0 z-50" : ""
      }`}
      style={{
        background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
        color: textColor,
        fontFamily: fontFamily || undefined
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 px-4">
        {iconLeft && <span>{iconLeft}</span>}
        {renderMessage()}
        {iconRight && <span>{iconRight}</span>}
        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 hover:opacity-70 transition-opacity"
            aria-label="Close announcement"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar1;
