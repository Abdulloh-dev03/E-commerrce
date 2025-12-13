"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Item = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string; // active state passed from parent
};

type Props = {
  items: Item[];
};

export default function MobileCategoryScroll({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // ✅ Auto-scroll active category into view
  useEffect(() => {
    if (!activeRef.current || !containerRef.current) return;

    activeRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [items]);

  return (
    <div
      className={cn(
        "md:hidden sticky top-0 z-30",
        "bg-background/90 backdrop-blur",
        "border-b border-border"
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex gap-2 px-3 py-2",
          "overflow-x-auto overflow-y-hidden",
          "max-w-full scrollbar-none",
          "scroll-smooth overscroll-x-contain"
        )}
        style={{
          WebkitOverflowScrolling: "touch", // ✅ iOS momentum scroll
        }}
      >
        {items.map((item, index) => {
          const isActive =
            item.className?.includes("border-blue-600");

          return (
            <button
              key={index}
              ref={isActive ? activeRef : null}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "min-w-[56px] h-[56px]",
                "rounded-lg border",
                "bg-card text-card-foreground",
                "transition active:scale-95",
                isActive
                  ? "border-gray-700 dark:bg-zinc-800"
                  : "border-border",
                item.className
              )}
            >
              {/* ICON */}
              <div className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
