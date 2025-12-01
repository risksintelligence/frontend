"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface MethodologySection {
  title: string;
  content: string | ReactNode;
  type?: "definition" | "inputs" | "process" | "outputs" | "technical";
}

interface MethodologyModalProps {
  title: string;
  subtitle?: string;
  sections: MethodologySection[];
  isOpen: boolean;
  onClose: () => void;
  documentationLink?: string;
  riskBand?: "minimal" | "low" | "moderate" | "high" | "critical";
}

export default function MethodologyModal({
  title,
  subtitle,
  sections,
  isOpen,
  onClose,
  documentationLink,
  riskBand,
}: MethodologyModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSectionIcon = (type?: string) => {
    switch (type) {
      case "definition":
        return "DEF";
      case "inputs":
        return "INP";
      case "process":
        return "PRC";
      case "outputs":
        return "OUT";
      case "technical":
        return "TEC";
      default:
        return "SEC";
    }
  };

  const getSectionColor = (type?: string) => {
    switch (type) {
      case "definition":
        return "border-blue-500/30 bg-blue-500/5";
      case "inputs":
        return "border-emerald-500/30 bg-emerald-500/5";
      case "process":
        return "border-orange-500/30 bg-orange-500/5";
      case "outputs":
        return "border-purple-500/30 bg-purple-500/5";
      case "technical":
        return "border-red-500/30 bg-red-500/5";
      default:
        return "border-terminal-border bg-terminal-surface";
    }
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-terminal-bg border border-terminal-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-terminal-border bg-terminal-surface">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-terminal-text font-mono uppercase">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-terminal-muted font-mono">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {riskBand && (
              <StatusBadge variant={riskBand === "critical" ? "critical" : 
                                     riskBand === "high" ? "warning" :
                                     riskBand === "moderate" ? "warning" : "good"}>
                {riskBand.toUpperCase()}
              </StatusBadge>
            )}
            
            {documentationLink && (
              <button
                onClick={() => window.open(documentationLink, "_blank")}
                className="flex items-center gap-1 px-3 py-1 text-xs font-mono text-terminal-muted hover:text-terminal-text border border-terminal-border rounded hover:bg-terminal-surface transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Docs
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${getSectionColor(section.type)}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-terminal-muted bg-terminal-border px-1 py-0.5 rounded">
                    {getSectionIcon(section.type)}
                  </span>
                  <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono tracking-wide">
                    {section.title}
                  </h3>
                </div>
                
                <div className="text-sm text-terminal-text font-mono leading-relaxed">
                  {typeof section.content === "string" ? (
                    <p>{section.content}</p>
                  ) : (
                    section.content
                  )}
                </div>
              </div>
            ))}
            
            {/* Footer */}
            <div className="border-t border-terminal-border pt-4">
              <p className="text-xs text-terminal-muted font-mono">
                This methodology follows institutional standards for transparency and reproducibility. 
                All models undergo governance board review per RRIO protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : null;
}

// Hook for managing methodology modal state
export function useMethodologyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<Omit<MethodologyModalProps, "isOpen" | "onClose">>({
    title: "",
    sections: [],
  });

  const openModal = (props: Omit<MethodologyModalProps, "isOpen" | "onClose">) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    modalProps,
  };
}