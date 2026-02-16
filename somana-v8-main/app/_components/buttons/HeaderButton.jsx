import React from "react";

const HeaderButton = ({ children }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="relative group cursor-pointer">
        <span className="text-sm font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 uppercase transition-all duration-300 group-hover:tracking-[0.25em]">
          {children}
        </span>
        <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 to-purple-400/50 rounded-full scale-x-75 group-hover:scale-x-100 transition-transform duration-300 hover:shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      </div>
    </div>
  );
};

export default HeaderButton;
