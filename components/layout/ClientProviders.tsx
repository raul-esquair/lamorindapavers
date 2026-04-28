"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import SmoothScroll from "@/components/animations/SmoothScroll";
import CustomCursor from "@/components/animations/CustomCursor";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { QuoteModalProvider } from "@/components/ui/QuoteModal";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // LazyMotion + domAnimation features (~25kb of motion code) are loaded only
  // when needed. Children should use `m.div` (etc.) instead of `motion.div` to
  // benefit from the lazy bundle. Non-strict mode: `motion.*` still works but
  // forces the full bundle to load synchronously, defeating the saving — so
  // every file in this codebase should use `m.*`.
  return (
    <QuoteModalProvider>
      <LazyMotion features={domAnimation}>
        <SmoothScroll>
          <CustomCursor />
          {children}
          <MobileBottomBar />
        </SmoothScroll>
      </LazyMotion>
    </QuoteModalProvider>
  );
}
