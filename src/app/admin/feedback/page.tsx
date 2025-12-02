"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";
import { buildApiUrl } from "@/lib/api-config";

interface FeedbackSummary {
  total_feedback: number;
  average_rating: number;
  rating_distribution: Record<string, number>;
  recent_feedback: Array<{
    page: string;
    rating: number;
    comment: string;
    category: string;
    timestamp: string;
  }>;
}

async function getFeedbackSummary(): Promise<FeedbackSummary> {
  const response = await fetch(buildApiUrl('/api/v1/analytics/feedback'));
  if (!response.ok) {
    throw new Error("Failed to fetch feedback summary");
  }
  return response.json();
}

export default function AdminFeedbackPage() {
  const { data: feedbackSummary, isLoading } = useQuery({
    queryKey: ["feedback-summary"],
    queryFn: getFeedbackSummary,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-terminal-accent" />
          <h1 className="text-3xl font-bold text-terminal-text">User Feedback Dashboard</h1>
        </div>
        <div className="text-terminal-muted">Loading feedback data...</div>
      </div>
    );
  }

  const totalFeedback = feedbackSummary?.total_feedback || 0;
  const avgRating = feedbackSummary?.average_rating || 0;
  const ratingDistribution = feedbackSummary?.rating_distribution || {};
  const recentFeedback = feedbackSummary?.recent_feedback || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="h-8 w-8 text-terminal-accent" />
        <h1 className="text-3xl font-bold text-terminal-text">User Feedback Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-terminal-bg border-terminal-border">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-terminal-muted text-sm">Total Feedback</p>
              <p className="text-2xl font-bold text-terminal-text">{totalFeedback}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-terminal-bg border-terminal-border">
          <div className="flex items-center gap-4">
            <Star className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-terminal-muted text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-terminal-text">{avgRating.toFixed(1)}/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-terminal-bg border-terminal-border">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-terminal-muted text-sm">Satisfaction Rate</p>
              <p className="text-2xl font-bold text-terminal-text">
                {totalFeedback > 0 ? Math.round((avgRating / 5) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="p-6 bg-terminal-bg border-terminal-border">
        <h2 className="text-xl font-bold text-terminal-text mb-4">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating.toString()] || 0;
            const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-terminal-text font-mono">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-terminal-surface rounded-full h-3 relative">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-terminal-muted font-mono w-16 text-right">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Feedback */}
      <Card className="p-6 bg-terminal-bg border-terminal-border">
        <h2 className="text-xl font-bold text-terminal-text mb-4">Recent Feedback</h2>
        {recentFeedback.length === 0 ? (
          <p className="text-terminal-muted">No feedback received yet.</p>
        ) : (
          <div className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="border-l-2 border-terminal-accent pl-4 py-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < feedback.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-terminal-muted font-mono text-sm">
                    {feedback.page}
                  </span>
                  {feedback.category && (
                    <span className="text-xs px-2 py-1 bg-terminal-surface text-terminal-accent rounded">
                      {feedback.category}
                    </span>
                  )}
                  <span className="text-terminal-muted font-mono text-xs ml-auto">
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {feedback.comment && (
                  <p className="text-terminal-text text-sm bg-terminal-surface p-3 rounded">
                    &quot;{feedback.comment}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
