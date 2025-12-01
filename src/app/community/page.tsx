"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeedbackWidget from "@/components/ui/FeedbackWidget";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useCommunityInsights } from "@/hooks/useCommunityInsights";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  AlertTriangle,
  ThumbsUp,
  Share2,
  Filter,
  Clock,
  Shield
} from "lucide-react";

interface CommunityInsight {
  id: string;
  title: string;
  content: string;
  author: string;
  category: "market-analysis" | "supply-chain" | "geopolitical" | "methodology" | "forecast";
  timestamp: string;
  likes: number;
  comments: number;
  risk_score: number;
  impact_level: "low" | "medium" | "high" | "critical";
  tags: string[];
  verified: boolean;
}

// Remove demo data - now using real hook data

const CATEGORY_LABELS = {
  "market-analysis": "Market Analysis",
  "supply-chain": "Supply Chain",
  "geopolitical": "Geopolitical",
  "methodology": "Methodology",
  "forecast": "Forecasting"
};

const IMPACT_COLORS = {
  low: "text-green-400 bg-green-400/20",
  medium: "text-yellow-400 bg-yellow-400/20",
  high: "text-orange-400 bg-orange-400/20",
  critical: "text-red-400 bg-red-400/20"
};

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "risk-score">("recent");
  
  const { data: insights, isLoading } = useCommunityInsights();

  const filteredInsights = (insights || [])
    .filter(insight => selectedCategory === "all" || insight.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.likes + b.comments) - (a.likes + a.comments);
        case "risk-score":
          return b.risk_score - a.risk_score;
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-terminal-accent" />
              <h1 className="text-3xl font-bold text-terminal-text">Risk Intelligence Community</h1>
            </div>
            <p className="text-terminal-muted">
              Share insights, collaborate on analysis, and discover new perspectives from finance and supply chain professionals
            </p>
          </div>
          <Button className="bg-terminal-accent hover:bg-terminal-accent/90 text-black">
            <MessageSquare className="h-4 w-4 mr-2" />
            Share Insight
          </Button>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-terminal-muted text-sm">Active Members</p>
                <p className="text-xl font-bold text-terminal-text">1,247</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-terminal-muted text-sm">Insights Shared</p>
                <p className="text-xl font-bold text-terminal-text">3,892</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-terminal-muted text-sm">Avg Risk Score</p>
                <p className="text-xl font-bold text-terminal-text">64.2</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              <div>
                <p className="text-terminal-muted text-sm">Critical Alerts</p>
                <p className="text-xl font-bold text-terminal-text">23</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-terminal-surface rounded border border-terminal-border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-terminal-muted" />
            <span className="text-terminal-text text-sm font-medium">Category:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-terminal-accent text-black"
                  : "text-terminal-muted hover:text-terminal-text"
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedCategory === key
                    ? "bg-terminal-accent text-black"
                    : "text-terminal-muted hover:text-terminal-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-terminal-text text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "risk-score")}
              className="bg-terminal-bg border border-terminal-border text-terminal-text px-2 py-1 rounded text-xs"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="risk-score">Highest Risk</option>
            </select>
          </div>
        </div>

        {/* Insights Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <SkeletonLoader variant="chart" />
          ) : filteredInsights.length === 0 ? (
            <Card className="p-8 bg-terminal-bg border-terminal-border text-center">
              <Brain className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
              <p className="text-terminal-muted">No insights found for the selected filters.</p>
            </Card>
          ) : (
            filteredInsights.map((insight) => (
            <Card key={insight.id} className="p-6 bg-terminal-bg border-terminal-border hover:border-terminal-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-terminal-text">{insight.title}</h3>
                    {insight.verified && (
                      <Shield className="h-4 w-4 text-terminal-accent" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-terminal-muted mb-3">
                    <span>{insight.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="px-2 py-1 bg-terminal-surface rounded text-xs">
                      {CATEGORY_LABELS[insight.category as keyof typeof CATEGORY_LABELS] || insight.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${IMPACT_COLORS[insight.impact_level as keyof typeof IMPACT_COLORS] || 'bg-gray-500'}`}>
                      {insight.impact_level.toUpperCase()} IMPACT
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-terminal-accent mb-1">
                    {insight.risk_score}
                  </div>
                  <div className="text-xs text-terminal-muted">Risk Score</div>
                </div>
              </div>
              
              <p className="text-terminal-text mb-4 leading-relaxed">
                {insight.content}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                {insight.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-terminal-surface text-terminal-accent text-xs rounded border border-terminal-border">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-terminal-muted hover:text-terminal-accent transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{insight.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-terminal-muted hover:text-terminal-accent transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{insight.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-terminal-muted hover:text-terminal-accent transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                <Button variant="outline" size="sm" className="text-terminal-accent border-terminal-accent hover:bg-terminal-accent hover:text-black">
                  View Analysis
                </Button>
              </div>
            </Card>
          ))
          )}
        </div>

        {/* Professional Network Notice */}
        <Card className="p-6 bg-terminal-surface/50 border-terminal-accent/30">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-terminal-accent mt-1" />
            <div>
              <h3 className="text-lg font-bold text-terminal-text mb-2">Professional Network</h3>
              <p className="text-terminal-text mb-3">
                This community is exclusively for verified finance and supply chain professionals. 
                All insights undergo peer review and are validated for methodology and accuracy.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded">
                  500+ Portfolio Managers
                </span>
                <span className="px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded">
                  300+ Supply Chain Directors
                </span>
                <span className="px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded">
                  200+ Risk Analysts
                </span>
                <span className="px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded">
                  150+ Academic Researchers
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <FeedbackWidget page="/community" />
    </MainLayout>
  );
}
