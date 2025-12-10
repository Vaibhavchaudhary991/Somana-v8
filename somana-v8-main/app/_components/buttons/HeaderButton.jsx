import React from "react";

const HeaderButton = ({ children }) => {
  return (
    <div>
      <p className="text-center mb-6">
        <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
          {children}
        </span>
      </p>
    </div>
  );
};

export default HeaderButton;
