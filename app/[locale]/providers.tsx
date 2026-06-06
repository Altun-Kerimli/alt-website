"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    // 1. Create the Intersection Observer
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            intersectionObserver.unobserve(entry.target); // Runs once per element
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // 2. Function to find and observe elements
    const observeElements = () => {
      document.querySelectorAll(".reveal-base:not(.reveal-visible)").forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    // 3. Run on mount and route changes
    observeElements();

    // 4. Watch for dynamic DOM changes (e.g., Supabase data loading in Portfolio)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}