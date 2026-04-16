"use client";

import SmoothScroll from "@/components/animations/SmoothScroll";
import CustomCursor from "@/components/animations/CustomCursor";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { QuoteModalProvider } from "@/components/ui/QuoteModal";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QuoteModalProvider>
      <SmoothScroll>
        <CustomCursor />
        {children}
        <MobileBottomBar />
      </SmoothScroll>
    </QuoteModalProvider>
  );
}
