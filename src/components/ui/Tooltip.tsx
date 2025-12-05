"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  placement = "top",
  delay = 300,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Create a temporary element to measure tooltip dimensions if not available
    const tooltipRect = tooltipRef.current 
      ? tooltipRef.current.getBoundingClientRect()
      : { width: 200, height: 40 }; // Default dimensions

    let x = 0;
    let y = 0;

    switch (placement) {
      case "top":
        x = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top + scrollY - tooltipRect.height - 8;
        break;
      case "bottom":
        x = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + scrollY + 8;
        break;
      case "left":
        x = triggerRect.left + scrollX - tooltipRect.width - 8;
        y = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case "right":
        x = triggerRect.right + scrollX + 8;
        y = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Keep tooltip within viewport
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x < padding) x = padding;
    if (x + tooltipRect.width > viewportWidth - padding) {
      x = viewportWidth - tooltipRect.width - padding;
    }
    if (y < padding + scrollY) y = padding + scrollY;
    if (y + tooltipRect.height > viewportHeight - padding + scrollY) {
      y = viewportHeight - tooltipRect.height - padding + scrollY;
    }

    setPosition({ x, y });
  }, [placement]);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Force a position update after the tooltip becomes visible
      setTimeout(() => {
        if (triggerRef.current) {
          updatePosition();
        }
      }, 0);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      const raf = requestAnimationFrame(() => {
        if (triggerRef.current && tooltipRef.current) {
          updatePosition();
        }
      });
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
      
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible, placement, updatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const tooltipElement = isVisible && (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] px-3 py-2 bg-terminal-bg border border-terminal-border rounded shadow-2xl max-w-xs pointer-events-none ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      role="tooltip"
    >
      <div className="text-xs font-mono text-terminal-text leading-relaxed">
        {content}
      </div>
      {/* Arrow indicator */}
      <div
        className={`absolute w-2 h-2 bg-terminal-bg border rotate-45 ${
          placement === "top"
            ? "bottom-[-5px] left-1/2 transform -translate-x-1/2 border-r-0 border-b-0"
            : placement === "bottom"
            ? "top-[-5px] left-1/2 transform -translate-x-1/2 border-l-0 border-t-0"
            : placement === "left"
            ? "right-[-5px] top-1/2 transform -translate-y-1/2 border-l-0 border-b-0"
            : "left-[-5px] top-1/2 transform -translate-y-1/2 border-r-0 border-t-0"
        }`}
        style={{
          borderColor: "inherit",
        }}
      />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {typeof document !== "undefined" && document.body && tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
}
