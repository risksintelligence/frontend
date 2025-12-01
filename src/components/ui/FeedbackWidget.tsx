"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, X, CheckCircle } from "lucide-react";

interface FeedbackWidgetProps {
  page: string;
  position?: "fixed" | "inline";
  className?: string;
}

export default function FeedbackWidget({ 
  page, 
  position = "fixed", 
  className = "" 
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/v1/analytics/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page,
          rating,
          comment: comment.trim() || null,
          category: category || null,
        }),
      });
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setRating(0);
        setComment("");
        setCategory("");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "usability", label: "Usability" },
    { value: "content", label: "Content Quality" },
    { value: "performance", label: "Performance" },
    { value: "feature_request", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "general", label: "General" }
  ];

  if (position === "fixed") {
    return (
      <>
        {/* Floating Feedback Button */}
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-[#00D4AA] hover:bg-[#00B494] text-black border-2 border-[#39FF14] ${className}`}
          size="lg"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Feedback
        </Button>

        {/* Feedback Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-md bg-black border-[#39FF14] border-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#39FF14] text-lg font-mono font-bold">
                  Page Feedback
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-[#00D4AA] hover:text-[#39FF14] hover:bg-[#001a16]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-[#39FF14] mx-auto mb-4" />
                  <p className="text-[#00D4AA] font-mono">
                    Thank you for your feedback!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#00D4AA] text-sm font-mono mb-2">
                      Rate this page *
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-2xl transition-colors"
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
                  </div>

                  <div>
                    <label className="block text-[#00D4AA] text-sm font-mono mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black border border-[#00D4AA] text-[#00D4AA] p-2 rounded font-mono text-sm focus:border-[#39FF14] focus:outline-none"
                    >
                      <option value="">Select category (optional)</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#00D4AA] text-sm font-mono mb-2">
                      Comments (optional)
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono text-sm placeholder:text-gray-600 focus:border-[#39FF14] resize-none"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="w-full bg-[#00D4AA] hover:bg-[#00B494] text-black font-mono font-bold border-2 border-[#39FF14] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </>
    );
  }

  // Inline version
  return (
    <Card className={`bg-black border-[#00D4AA] border-2 p-4 ${className}`}>
      <h4 className="text-[#39FF14] text-sm font-mono font-bold mb-3">
        Rate this page
      </h4>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-lg transition-colors"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= rating
                    ? "fill-[#39FF14] text-[#39FF14]"
                    : "text-gray-600 hover:text-[#00D4AA]"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="bg-[#00D4AA] hover:bg-[#00B494] text-black font-mono text-xs border border-[#39FF14]"
          >
            {isSubmitting ? "..." : "Submit"}
          </Button>
        )}
      </div>
      {isSubmitted && (
        <p className="text-[#39FF14] text-xs font-mono mt-2">
          ✓ Thank you for your feedback!
        </p>
      )}
    </Card>
  );
}