import React from 'react';

const AnnouncementBar1: React.FC = () => {
  return (
    <div className="min-h-8 sm:min-h-10 lg:min-h-14 flex items-center justify-center bg-linear-to-r from-[#50D1F6] to-[#B198FD] text-black text-center text-xs sm:text-sm font-bold">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2">
        <span>🔥</span>
        <span>For a limited time, enjoy a 20% discount on all our products !</span>
        <span>🔥</span>
      </div>
    </div>
  );
};

export default AnnouncementBar1;
