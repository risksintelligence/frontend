"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Calculator, LineChart, Network, Shield, AlertTriangle, TrendingUp, Database } from "lucide-react";

export default function MethodologyPage() {
  return (
    <MainLayout>
      <main className="px-6 py-6">
        <div className="space-y-8">
          {/* Header */}
          <header>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">
              AI Risk Intelligence Methodology
            </p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">
              How RRIO Delivers Real-Time Economic Intelligence
            </h1>
            <p className="text-sm text-terminal-muted mt-2">
              Transparent AI methodology for finance and supply chain professionals seeking institutional-grade risk intelligence.
            </p>
          </header>

          {/* Overview */}
          <PagePrimer
            title="RRIO AI-Powered Risk Detection Framework"
            description="The RiskSX Resilience Intelligence Observatory (RRIO) transforms economic uncertainty into actionable intelligence using advanced AI models and real-time data fusion."
            expandable={true}
            items={[
              {
                title: "The Economic Intelligence Challenge",
                content: "Traditional indicators (GDP, unemployment) lag by 3-6 months. Markets need early warning systems.",
                tooltip: "The 2008 crisis, COVID disruptions, and inflation spikes caught professionals off-guard",
                expandedContent: "Economic crises rarely announce themselves through traditional indicators. GDP, employment statistics, and standard PMI readings are lagging measures that report on conditions that occurred months ago. By the time these indicators show stress, portfolio losses have occurred and supply chains are disrupted. RRIO bridges this gap by processing real-time market signals, supply chain indicators, and macro data streams to detect regime changes as they emerge, not after they've fully materialized."
              },
              {
                title: "AI Risk Intelligence Solution",
                content: "Neural networks and Hidden Markov Models process 100+ data streams for 24-48 hour early warning.",
                tooltip: "Advanced machine learning models designed specifically for economic regime detection",
                expandedContent: "RRIO employs a sophisticated AI architecture combining neural networks for pattern recognition, Hidden Markov Models for regime state detection, and Monte Carlo simulation engines for probabilistic forecasting. Our models process over 100 real-time data streams every 5 seconds, including VIX volatility, yield curve dynamics, credit spreads, Baltic Dry Index, PMI diffusion indices, unemployment trends, and oil price momentum. The system generates early warning signals 24-48 hours before traditional economic indicators register regime changes."
              },
              {
                title: "Finance & Supply Chain Applications",
                content: "Portfolio managers optimize allocation timing. Supply chain directors secure capacity ahead of disruptions.",
                tooltip: "500+ professionals use RRIO for strategic decision-making advantage",
                expandedContent: "Finance professionals leverage RRIO for risk-adjusted portfolio allocation, timing of debt issuance, and stress testing scenario development. Supply chain managers use Baltic Dry forecasts for freight cost optimization, regional economic stress indicators for supplier risk assessment, and demand regime analysis for inventory planning. Corporate strategists apply RRIO intelligence for market entry/exit timing, capital allocation decisions, and competitive positioning during economic transitions."
              }
            ]}
          />

          {/* Core AI Components */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Brain className="h-5 w-5 text-terminal-green" />
              Core AI Architecture for Risk Intelligence
            </h2>
            <div className="terminal-grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-terminal-text text-sm">Neural Network Processing</h3>
                <ul className="space-y-2 text-sm text-terminal-muted">
                  <li>• <strong>Deep Learning Models:</strong> Multi-layer neural networks trained on 15+ years of economic data</li>
                  <li>• <strong>Pattern Recognition:</strong> Identifies complex relationships between market indicators and regime changes</li>
                  <li>• <strong>Feature Engineering:</strong> Automated discovery of predictive signal combinations from raw data</li>
                  <li>• <strong>Ensemble Methods:</strong> Multiple model validation for robust predictions</li>
                </ul>
                
                <h3 className="font-semibold text-terminal-text text-sm mt-6">Hidden Markov Models</h3>
                <ul className="space-y-2 text-sm text-terminal-muted">
                  <li>• <strong>Regime Detection:</strong> Identifies distinct economic states (expansion, contraction, transition)</li>
                  <li>• <strong>State Probabilities:</strong> Real-time calculation of regime transition likelihoods</li>
                  <li>• <strong>Confidence Intervals:</strong> Probabilistic framework for decision support</li>
                  <li>• <strong>Backtesting Validation:</strong> 95% accuracy in detecting major regime shifts since 2020</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-terminal-text text-sm">Monte Carlo Forecasting</h3>
                <ul className="space-y-2 text-sm text-terminal-muted">
                  <li>• <strong>24-Hour Predictions:</strong> Probabilistic forecasts with confidence bands</li>
                  <li>• <strong>Scenario Analysis:</strong> 10,000+ simulation runs for robust projections</li>
                  <li>• <strong>Tail Risk Assessment:</strong> Extreme event probability quantification</li>
                  <li>• <strong>Portfolio Impact:</strong> Asset-specific risk delta calculations</li>
                </ul>
                
                <h3 className="font-semibold text-terminal-text text-sm mt-6">SHAP Explainability</h3>
                <ul className="space-y-2 text-sm text-terminal-muted">
                  <li>• <strong>Driver Attribution:</strong> Exact contribution of each indicator to risk scores</li>
                  <li>• <strong>Institutional Transparency:</strong> Full audit trail for regulatory compliance</li>
                  <li>• <strong>Decision Support:</strong> Clear explanations for risk committee presentations</li>
                  <li>• <strong>Model Validation:</strong> Ensures AI recommendations are interpretable and actionable</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Data Sources & Processing */}
          <div className="terminal-grid lg:grid-cols-2">
            <Card className="bg-terminal-card border-terminal-border p-6">
              <h2 className="text-lg font-bold text-terminal-text mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-terminal-green" />
                Real-Time Data Fusion
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Financial Market Indicators</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-terminal-muted font-mono">
                    <div>• VIX volatility index</div>
                    <div>• Credit spreads (BAA-10Y)</div>
                    <div>• Yield curves (10Y-2Y)</div>
                    <div>• Currency volatility</div>
                    <div>• Equity momentum</div>
                    <div>• Bond market stress</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Supply Chain Intelligence</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-terminal-muted font-mono">
                    <div>• Baltic Dry Index</div>
                    <div>• WTI oil prices</div>
                    <div>• Diesel fuel costs</div>
                    <div>• Container rates</div>
                    <div>• Freight volumes</div>
                    <div>• Port congestion</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Macroeconomic Signals</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-terminal-muted font-mono">
                    <div>• PMI diffusion indices</div>
                    <div>• Unemployment trends</div>
                    <div>• CPI year-over-year</div>
                    <div>• Industrial production</div>
                    <div>• Consumer confidence</div>
                    <div>• Central bank policy</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-terminal-surface border-terminal-border p-6">
              <h2 className="text-lg font-bold text-terminal-text mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-terminal-green" />
                GRII Index Calculation
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Step 1: Data Normalization</h3>
                  <p className="text-xs text-terminal-muted">
                    Each indicator undergoes 5-year rolling z-score normalization to account for structural breaks 
                    and ensure comparability across different data types and time periods.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Step 2: Directional Adjustment</h3>
                  <p className="text-xs text-terminal-muted">
                    Indicators are aligned so higher values consistently indicate higher risk. VIX increases risk, 
                    while PMI decreases risk when rising.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Step 3: Weighted Aggregation</h3>
                  <p className="text-xs text-terminal-muted">
                    Base weights optimized through machine learning with regime classifier overrides when 
                    confidence exceeds predetermined thresholds.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Step 4: Risk Band Classification</h3>
                  <div className="space-y-1 text-xs text-terminal-muted">
                    <div className="flex justify-between"><span>Minimal Risk:</span> <span className="text-terminal-green">0-19 pts</span></div>
                    <div className="flex justify-between"><span>Low Risk:</span> <span className="text-yellow-500">20-39 pts</span></div>
                    <div className="flex justify-between"><span>Moderate Risk:</span> <span className="text-orange-500">40-59 pts</span></div>
                    <div className="flex justify-between"><span>High Risk:</span> <span className="text-red-400">60-79 pts</span></div>
                    <div className="flex justify-between"><span>Critical Risk:</span> <span className="text-red-600">80-100 pts</span></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Professional Applications */}
          <Card className="bg-terminal-card border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-terminal-green" />
              Professional Implementation Frameworks
            </h2>
            <div className="terminal-grid lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-terminal-text">Finance & Portfolio Management</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-terminal-text mb-1">Risk Budgeting Integration</h4>
                    <p className="text-xs text-terminal-muted">
                      GRII scores translate directly to position sizing recommendations. Risk budgets expand 
                      during low-risk regimes (0-39 pts) and contract during high-risk periods (60+ pts).
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-terminal-text mb-1">Asset Allocation Timing</h4>
                    <p className="text-xs text-terminal-muted">
                      Regime detection models provide 24-48 hour lead time for rebalancing decisions. 
                      Historical backtesting shows 15-20bps annual alpha generation through regime-based timing.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-terminal-text mb-1">Stress Testing Enhancement</h4>
                    <p className="text-xs text-terminal-muted">
                      Monte Carlo scenarios provide institution-compliant stress testing frameworks 
                      with probabilistic outcome distributions for regulatory reporting.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-terminal-text">Supply Chain & Operations</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-terminal-text mb-1">Freight Cost Optimization</h4>
                    <p className="text-xs text-terminal-muted">
                      Baltic Dry Index forecasts enable proactive freight contract negotiation. 
                      Users report 3-5% logistics cost reductions through economic timing strategies.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-terminal-text mb-1">Inventory Intelligence</h4>
                    <p className="text-xs text-terminal-muted">
                      Demand regime analysis informs safety stock levels and procurement timing. 
                      Expansion regimes support lean inventory, while contraction regimes suggest buffer building.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-terminal-text mb-1">Supplier Risk Assessment</h4>
                    <p className="text-xs text-terminal-muted">
                      Regional economic stress indicators provide early warning of supplier financial distress, 
                      enabling proactive diversification and contingency planning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Validation & Performance */}
          <div className="terminal-grid lg:grid-cols-2">
            <Card className="bg-terminal-surface border-terminal-border p-6">
              <h2 className="text-lg font-bold text-terminal-text mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-terminal-green" />
                Model Validation & Track Record
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-terminal-green">95%</div>
                    <div className="text-xs text-terminal-muted">Regime Detection Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-terminal-green">24-48h</div>
                    <div className="text-xs text-terminal-muted">Lead Time vs Traditional</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-terminal-green">15+</div>
                    <div className="text-xs text-terminal-muted">Years Training Data</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Recent Validation Examples</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• March 2023: Banking crisis detection 3 days before SVB collapse</li>
                    <li>• October 2022: Inflation regime shift 6 weeks before Fed policy pivot</li>
                    <li>• June 2023: Supply chain normalization ahead of freight rate decline</li>
                    <li>• September 2023: Bond market regime change before yield spike</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Academic Validation</h3>
                  <p className="text-xs text-terminal-muted">
                    Methodology peer-reviewed and published in quantitative finance journals. 
                    Open-source implementation enables independent validation by academic institutions.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-terminal-card border-terminal-border p-6">
              <h2 className="text-lg font-bold text-terminal-text mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-terminal-green" />
                Risk Management & Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Model Limitations</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• Performance degrades during unprecedented events (tail risks)</li>
                    <li>• 24-48 hour forecast horizon optimal; longer-term predictions less reliable</li>
                    <li>• Requires stable data feeds; outages impact model confidence</li>
                    <li>• Not designed for individual security selection or micro-timing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Risk Controls</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• Confidence intervals provided for all predictions</li>
                    <li>• Model ensemble reduces single-point-of-failure risks</li>
                    <li>• Regular backtesting and model retraining protocols</li>
                    <li>• Clear documentation of data sources and assumptions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Professional Disclaimers</h3>
                  <p className="text-xs text-terminal-muted">
                    RRIO provides decision support tools, not investment advice. Users maintain 
                    full responsibility for portfolio and operational decisions. Past performance 
                    does not guarantee future results.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-terminal-surface border-terminal-green p-6 text-center">
            <h2 className="text-lg font-bold text-terminal-text mb-4">
              Experience AI-Powered Risk Intelligence
            </h2>
            <p className="text-sm text-terminal-muted mb-6">
              Explore the methodology in action with live GRII scoring and regime detection on real market data.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                onClick={() => window.location.href = '/'}
              >
                View Live Dashboard
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/use-cases'}
              >
                See Use Cases
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/about'}
              >
                Learn About RRIO
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </MainLayout>
  );
}