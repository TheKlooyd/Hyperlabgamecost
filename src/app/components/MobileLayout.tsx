import React from "react";
import { PixelCompanion } from "./PixelCompanion";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hideAssistant?: boolean;
}

export function MobileLayout({
  children,
  className = "",
  noPadding = false,
  hideAssistant = false,
}: MobileLayoutProps) {
  return (
    <div
      style={{ maxWidth: "430px", margin: "0 auto", position: "relative", minHeight: "100vh" }}
      className={className}
    >
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: noPadding ? "0" : "16px",
        }}
      >
        {children}
        {/* PIXEL COMPANION en lugar de chatbot tradicional */}
        {!hideAssistant && <PixelCompanion position="corner" />}
      </div>
    </div>
  );
}