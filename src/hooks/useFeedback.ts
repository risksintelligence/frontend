"use client";

import { useState } from "react";
import { buildApiUrl, getApiFetch } from "@/lib/api-config";

interface FeedbackData {
  page: string;
  rating: number;
  comment?: string;
  category?: string;
}


export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (feedbackData: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const fetchFn = getApiFetch();
      const response = await fetchFn(buildApiUrl("/api/v1/analytics/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.status}`);
      }

      const result = await response.json();
      setIsSubmitted(true);
      
      // Track feedback submission event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "feedback_submission", {
          event_category: "user_interaction",
          event_label: `${feedbackData.page} - ${feedbackData.rating} stars`,
          value: feedbackData.rating,
          custom_parameter: {
            page: feedbackData.page,
            rating: feedbackData.rating,
            category: feedbackData.category
          }
        });
      }

      // Custom analytics tracking
      const analyticsFetchFn = getApiFetch();
      analyticsFetchFn(buildApiUrl("/api/v1/analytics/event"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "feedback_submission",
          parameters: {
            page: feedbackData.page,
            rating: feedbackData.rating,
            category: feedbackData.category,
            has_comment: !!feedbackData.comment
          },
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
        }),
      }).catch(() => {
        // Silent fail
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setIsSubmitted(false);
    setError(null);
    setIsSubmitting(false);
  };

  return {
    submitFeedback,
    isSubmitting,
    isSubmitted,
    error,
    resetState,
  };
};
