import React from "react";

interface MacbookFrameProps {
  children: React.ReactNode;
}

export const MacbookFrame: React.FC<MacbookFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto my-8 w-full max-w-[900px] select-none">
      {/* Macbook body with enhanced green glow effect */}
      <div className="rounded-t-xl bg-gray-800 p-2 pb-0 shadow-[0_0_40px_5px_rgba(74,222,128,0.5),0_0_15px_2px_rgba(74,222,128,0.6)]">
        {/* Webcam area */}
        <div className="mx-auto mb-1 h-2 w-20 rounded-b-lg bg-gray-700 pb-1">
          <div className="mx-auto h-1.5 w-1.5 rounded-full bg-gray-600 ring-1 ring-gray-600/50"></div>
        </div>
        {/* Screen area - 16:10 aspect ratio (similar to MacBook 13-inch) */}
        <div className="overflow-hidden rounded-lg bg-[#2a2a2a] shadow-xl" style={{ aspectRatio: '16/10' }}>
          {children}
        </div>
      </div>
      {/* Macbook bottom part */}
      <div className="flex h-4 items-center justify-center rounded-b-lg bg-gray-700 shadow-[0_5px_20px_rgba(74,222,128,0.4)]">
        <div className="h-1 w-12 rounded-full bg-gray-600"></div>
      </div>
      {/* Macbook base/shadow */}
      <div className="mx-auto -mt-[1px] h-[1px] w-40 bg-gray-700 shadow-lg"></div>
    </div>
  );
};
