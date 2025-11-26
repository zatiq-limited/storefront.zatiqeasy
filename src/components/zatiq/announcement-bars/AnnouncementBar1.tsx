import React from "react";

interface AnnouncementBar1Props {
  message?: string;
  icon_left?: string;
  icon_right?: string;
  gradient_start?: string;
  gradient_end?: string;
  text_color?: string;
  dismissible?: boolean;
  sticky?: boolean;
  fontFamily?: string;
}

const AnnouncementBar1: React.FC<AnnouncementBar1Props> = ({
  message,
  icon_left,
  icon_right,
  gradient_start,
  gradient_end,
  text_color,
  dismissible,
  sticky,
  fontFamily,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={`min-h-8 sm:min-h-10 lg:min-h-14 flex items-center justify-center text-center text-xs sm:text-sm font-bold ${
        sticky ? "sticky top-0 z-50" : ""
      }`}
      style={{
        background: `linear-gradient(to right, ${gradient_start}, ${gradient_end})`,
        color: text_color,
        fontFamily: fontFamily || undefined
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 px-4">
        {icon_left && <span>{icon_left}</span>}
        <span>{message}</span>
        {icon_right && <span>{icon_right}</span>}
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
