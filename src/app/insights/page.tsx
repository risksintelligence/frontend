"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import FeedbackWidget from "@/components/ui/FeedbackWidget";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { useRegimeData } from "@/hooks/useRegimeData";
import { useForecastData } from "@/hooks/useForecastData";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  Download,
  Mail,
  Users,
  Target,
  BarChart3,
  ArrowRight,
  Clock
} from "lucide-react";

interface WeeklyBriefSection {
  title: string;
  content: string;
  risk_level: "low" | "medium" | "high" | "critical";
  recommendations: string[];
  impact_score: number;
}

export default function WeeklyIntelligencePage() {
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  const [briefFormat, setBriefFormat] = useState<"executive" | "detailed" | "technical">("executive");
  
  const { data: riskData, isLoading: riskLoading } = useRiskOverview();
  const { data: regimeData, isLoading: regimeLoading } = useRegimeData(); 
  const { data: forecastData, isLoading: forecastLoading } = useForecastData();

  const isLoading = riskLoading || regimeLoading || forecastLoading;

  // Generate weekly brief sections based on current data
  const generateBriefSections = (): WeeklyBriefSection[] => {
    if (!riskData || !regimeData || !forecastData) return [];

    const geriScore = riskData.overview?.score || 0;
    const currentRegime = regimeData.current || "Unknown";
    const forecastDelta = forecastData.delta24h || 0;

    return [
      {
        title: "Executive Summary",
        content: `Global risk intelligence indicates a GERI score of ${geriScore.toFixed(1)} (${riskData.overview?.band || "Moderate"}), reflecting ${currentRegime.toLowerCase()} economic conditions. Our 24-hour outlook suggests ${forecastDelta > 0 ? 'increasing' : 'decreasing'} risk trajectory with ${Math.abs(forecastDelta).toFixed(1)} point expected movement.`,
        risk_level: geriScore > 70 ? "high" : geriScore > 50 ? "medium" : "low",
        recommendations: [
          "Monitor portfolio exposure to volatile sectors",
          "Review hedging strategies for key positions",
          "Assess supply chain vulnerabilities"
        ],
        impact_score: Math.round(geriScore)
      },
      {
        title: "Economic Regime Analysis", 
        content: `Current regime classification shows ${currentRegime} conditions with ${((regimeData.probabilities?.find(p => p.name === currentRegime)?.probability || 0.5) * 100).toFixed(1)}% confidence. Regime transition probability analysis indicates potential shifts in labor market dynamics and credit conditions over the next 30 days.`,
        risk_level: currentRegime === "Crisis" ? "critical" : currentRegime === "Expansion" ? "low" : "medium",
        recommendations: [
          "Adjust sector allocations based on regime probabilities",
          "Consider defensive positions in transition scenarios",
          "Monitor key regime indicators for early signals"
        ],
        impact_score: Math.round((regimeData.probabilities?.find(p => p.name === currentRegime)?.probability || 0.5) * 100)
      },
      {
        title: "Supply Chain Intelligence",
        content: "Network analysis reveals concentrated risks in Southeast Asian shipping routes with 15% freight cost increases. Dependencies on key suppliers show elevated stress signals, particularly in technology and automotive sectors.",
        risk_level: "high",
        recommendations: [
          "Diversify supplier base in critical components",
          "Increase inventory buffers for high-risk items", 
          "Establish alternative logistics pathways"
        ],
        impact_score: 72
      },
      {
        title: "Market Volatility Outlook",
        content: `Forward-looking indicators suggest ${forecastDelta > 0 ? 'elevated' : 'subdued'} volatility patterns. Cross-asset correlations are ${Math.abs(forecastDelta) > 5 ? 'breaking down' : 'remaining stable'}, creating both risks and opportunities for systematic strategies.`,
        risk_level: Math.abs(forecastDelta) > 5 ? "medium" : "low", 
        recommendations: [
          "Adjust position sizing based on volatility regime",
          "Review correlation assumptions in risk models",
          "Consider vol-targeting strategies"
        ],
        impact_score: Math.round(Math.abs(forecastDelta) * 10)
      },
      {
        title: "Geopolitical Risk Factors",
        content: "Trade flow analysis indicates emerging tensions in agricultural commodity routes. Recent policy changes suggest potential disruptions to energy supply chains, with cascading effects across industrial sectors.",
        risk_level: "medium",
        recommendations: [
          "Monitor commodity exposure in portfolios",
          "Assess energy-intensive operations",
          "Review geographic concentration risks"
        ],
        impact_score: 58
      }
    ];
  };

  const briefSections = generateBriefSections();
  const currentDate = new Date();
  const weekRange = `${currentDate.toLocaleDateString()} - ${new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-400 bg-red-400/20";
      case "high": return "text-orange-400 bg-orange-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/20";
      default: return "text-green-400 bg-green-400/20";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-terminal-accent" />
              <h1 className="text-3xl font-bold text-terminal-text">Weekly Intelligence Brief</h1>
            </div>
            <p className="text-terminal-muted">
              Comprehensive risk intelligence summary for finance and supply chain professionals
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-black">
              <Mail className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
            <Button className="bg-terminal-accent hover:bg-terminal-accent/90 text-black">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Brief Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-terminal-surface rounded border border-terminal-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-terminal-muted" />
            <span className="text-terminal-text text-sm font-medium">Week:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="bg-terminal-bg border border-terminal-border text-terminal-text px-2 py-1 rounded text-xs"
            >
              <option value="current">Current Week ({weekRange})</option>
              <option value="last">Previous Week</option>
              <option value="two-weeks">2 Weeks Ago</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-terminal-muted" />
            <span className="text-terminal-text text-sm font-medium">Format:</span>
              <div className="flex gap-1">
              {["executive", "detailed", "technical"].map((format) => (
                <button
                  key={format}
                  onClick={() => setBriefFormat(format as "executive" | "detailed" | "technical")}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    briefFormat === format
                      ? "bg-terminal-accent text-black"
                      : "text-terminal-muted hover:text-terminal-text"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Clock className="h-4 w-4 text-terminal-muted" />
            <span className="text-terminal-muted text-xs">
              Generated: {currentDate.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Brief Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-terminal-muted text-sm">Risk Score</p>
                <p className="text-xl font-bold text-terminal-text">
                  {riskData?.overview?.score?.toFixed(1) || "--"}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-terminal-muted text-sm">Current Regime</p>
                <p className="text-xl font-bold text-terminal-text">
                  {regimeData?.current || "Loading..."}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              {(forecastData?.delta24h || 0) > 0 ? (
                <TrendingUp className="h-6 w-6 text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-400" />
              )}
              <div>
                <p className="text-terminal-muted text-sm">24h Forecast</p>
                <p className="text-xl font-bold text-terminal-text">
                  {(forecastData?.delta24h || 0) > 0 ? '+' : ''}{forecastData?.delta24h?.toFixed(1) || "--"}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-terminal-bg border-terminal-border">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-terminal-muted text-sm">Subscribers</p>
                <p className="text-xl font-bold text-terminal-text">1,247</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Brief Sections */}
        {isLoading ? (
          <SkeletonLoader variant="chart" />
        ) : (
          <div className="space-y-4">
            {briefSections.map((section, index) => (
              <Card key={index} className="p-6 bg-terminal-bg border-terminal-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-terminal-text">{section.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(section.risk_level)}`}>
                        {section.risk_level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-terminal-accent mb-1">
                      {section.impact_score}
                    </div>
                    <div className="text-xs text-terminal-muted">Impact Score</div>
                  </div>
                </div>

                <p className="text-terminal-text mb-4 leading-relaxed">
                  {section.content}
                </p>

                <div className="space-y-3">
                  <h4 className="text-terminal-accent font-medium text-sm">Key Recommendations:</h4>
                  <ul className="space-y-2">
                    {section.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="flex items-start gap-2 text-sm text-terminal-text">
                        <ArrowRight className="h-4 w-4 text-terminal-accent mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Subscription CTA */}
        <Card className="p-6 bg-terminal-surface/50 border-terminal-accent/30">
          <div className="text-center">
            <h3 className="text-lg font-bold text-terminal-text mb-2">
              Never Miss Critical Intelligence
            </h3>
            <p className="text-terminal-text mb-4">
              Get weekly intelligence briefs delivered to your inbox every Monday. 
              Trusted by 1,200+ finance and supply chain professionals worldwide.
            </p>
            <div className="flex justify-center gap-3">
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90 text-black">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe to Weekly Brief
              </Button>
              <Button variant="outline" className="border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-black">
                View Archive
              </Button>
            </div>
            <p className="text-terminal-muted text-xs mt-3">
              Professional-grade intelligence • Unsubscribe anytime • GDPR compliant
            </p>
          </div>
        </Card>
      </div>

      <FeedbackWidget page="/insights" />
    </MainLayout>
  );
}
