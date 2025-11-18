interface AnnouncementBar1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function AnnouncementBar1({ settings, blocks, pageData }: AnnouncementBar1Props) {
  const message = settings?.message || "For a limited time, enjoy a 20% discount on all our products !";
  const icon = settings?.icon || "🔥";
  const bgGradientFrom = settings?.bgGradientFrom || "#50D1F6";
  const bgGradientTo = settings?.bgGradientTo || "#B198FD";
  
  return (
    <div 
      className="max-w-[1440px] min-h-14 mx-auto flex items-center justify-center text-black text-center text-xs sm:text-sm font-bold"
      style={{
        background: `linear-gradient(to right, ${bgGradientFrom}, ${bgGradientTo})`
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{icon}</span>
        <span>{message}</span>
        <span>{icon}</span>
      </div>
    </div>
  );
}
