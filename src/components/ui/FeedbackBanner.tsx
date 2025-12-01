"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, Star } from "lucide-react";
import { useFeedback } from "@/hooks/useFeedback";

interface FeedbackBannerProps {
  page: string;
  trigger?: "time" | "scroll" | "interaction";
  delay?: number;
  className?: string;
}

export default function FeedbackBanner({
  page,
  trigger = "time",
  delay = 30000, // 30 seconds
  className = ""
}: FeedbackBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    const dismissed = localStorage.getItem(`feedback-banner-${page}`);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (dismissedTime > oneDayAgo) return true;
    }
    return false;
  });
  const [rating, setRating] = useState(0);
  const { submitFeedback, isSubmitting, isSubmitted } = useFeedback();

  useEffect(() => {
    if (isDismissed) return;
    if (trigger === "time") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    if (trigger === "scroll") {
      const handleScroll = () => {
        if (window.scrollY > 500 && !isVisible && !isDismissed) {
          setIsVisible(true);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (trigger === "interaction") {
      const handleInteraction = () => {
        const timer = setTimeout(() => {
          if (!isVisible && !isDismissed) {
            setIsVisible(true);
          }
        }, 5000);
        return () => clearTimeout(timer);
      };
      
      document.addEventListener("click", handleInteraction);
      return () => document.removeEventListener("click", handleInteraction);
    }
  }, [trigger, delay, page, isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    const timestamp = new Date().toISOString();
    localStorage.setItem(`feedback-banner-${page}`, timestamp);
  };

  const handleQuickRating = async (selectedRating: number) => {
    setRating(selectedRating);
    try {
      await submitFeedback({
        page,
        rating: selectedRating,
        category: "quick_rating"
      });
      setTimeout(handleDismiss, 1500);
    } catch (error) {
      console.error("Failed to submit quick rating:", error);
    }
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className={`fixed bottom-20 left-4 right-4 z-40 ${className}`}>
      <div className="max-w-md mx-auto bg-black border-2 border-[#39FF14] rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#39FF14]" />
            <h4 className="text-[#39FF14] font-mono font-bold text-sm">
              Quick Feedback
            </h4>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#00D4AA] hover:text-[#39FF14] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-2">
            <p className="text-[#00D4AA] font-mono text-sm">
              ✓ Thank you for your feedback!
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#00D4AA] font-mono text-sm mb-3">
              How would you rate this page?
            </p>
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleQuickRating(star)}
                  disabled={isSubmitting}
                  className="transition-all hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-[#39FF14] text-[#39FF14]"
                        : "text-gray-600 hover:text-[#00D4AA]"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-mono text-center">
              Click a star to submit quick feedback
            </p>
          </>
        )}
      </div>
    </div>
  );
}
