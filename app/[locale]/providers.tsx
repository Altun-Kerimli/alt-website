"use client";

import { ThemeProvider } from "next-themes";

// React 19 / Next.js 16+ Development Patch
// Suppresses the false-positive warning caused by next-themes injecting a script tag.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return; // Intercept and ignore this specific React 19 warning
    }
    originalConsoleError.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}