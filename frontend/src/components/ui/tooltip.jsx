import React, { createContext, useContext } from "react";

const TooltipContext = createContext();

export function TooltipProvider({ children }) {
  return (
    <TooltipContext.Provider value={{}}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  return useContext(TooltipContext);
}

// A simple Tooltip component
export function Tooltip({ children, tip }) {
  return (
    <span style={{ position: "relative", cursor: "pointer" }}>
      {children}
      <span
        style={{
          visibility: "hidden",
          position: "absolute",
          background: "black",
          color: "white",
          padding: "0.5rem",
          borderRadius: "0.25rem",
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
        }}
      >
        {tip}
      </span>
    </span>
  );
}
