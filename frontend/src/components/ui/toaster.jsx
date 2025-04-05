import React, { useState, useEffect } from "react";

export function Toaster() {
  const [messages, setMessages] = useState([]);

  // Simple toast implementation: clear messages after 3 seconds
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => setMessages([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1000 }}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            background: "#0f172a",
            color: "white",
            padding: "1rem",
            marginBottom: "0.5rem",
            borderRadius: "0.375rem",
          }}
        >
          {msg}
        </div>
      ))}
    </div>
  );
}

