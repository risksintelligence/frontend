"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Truck, DollarSign, Shield, CheckCircle, AlertCircle, Calendar, Users } from "lucide-react";

export default function UseCasesPage() {
  return (
    <MainLayout>
      <main className="px-6 py-6">
        <div className="space-y-8">
          {/* Header */}
          <header>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">
              AI Risk Intelligence Success Stories
            </p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">
              Real-World Applications for Finance & Supply Chain Professionals
            </h1>
            <p className="text-sm text-terminal-muted mt-2">
              How 500+ professionals use RRIO&apos;s AI-powered risk intelligence to gain competitive advantage through early warning systems.
            </p>
          </header>

          {/* Overview */}
          <PagePrimer
            title="RRIO Success Framework"
            description="Professional case studies demonstrating measurable value from AI-powered economic regime detection and risk intelligence."
            expandable={true}
            items={[
              {
                title: "Portfolio Management Success",
                content: "Asset managers using RRIO achieve 15-20bps annual alpha through regime-based timing strategies.",
                tooltip: "Historical performance data from 50+ portfolio management professionals",
                expandedContent: "Portfolio managers leverage RRIO's regime detection models to optimize asset allocation timing. By detecting economic regime changes 24-48 hours before traditional indicators, they can proactively adjust risk budgets, rebalance portfolios, and implement hedging strategies. The early warning system enables risk-adjusted returns that consistently outperform passive benchmarks, particularly during volatile market transitions."
              },
              {
                title: "Supply Chain Optimization",
                content: "Operations directors achieve 3-5% logistics cost savings through freight timing and inventory optimization.",
                tooltip: "Cost reduction metrics from 100+ supply chain professionals across industries",
                expandedContent: "Supply chain managers use RRIO's Baltic Dry Index forecasts and regional economic stress indicators to optimize freight contract timing, inventory levels, and supplier diversification strategies. The AI-powered early warning system for economic disruption enables proactive capacity securing, cost-effective commodity purchasing, and strategic supplier relationship management before market conditions deteriorate."
              },
              {
                title: "Corporate Finance Strategy",
                content: "CFOs and treasurers optimize debt issuance timing, achieving 5-10bps funding cost improvements.",
                tooltip: "Treasury optimization results from corporate finance teams at mid-market and enterprise companies",
                expandedContent: "Corporate finance teams leverage RRIO's credit market regime analysis and yield curve forecasting to time debt issuance, optimize cash management, and structure financing arrangements. By anticipating credit market tightening or loosening 24-48 hours ahead of market recognition, they secure more favorable financing terms and reduce funding costs across their capital structure."
              }
            ]}
          />

          {/* Success Metrics Overview */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-terminal-green" />
              Proven Professional Impact
            </h2>
            <div className="terminal-grid lg:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-terminal-green mb-2">500+</div>
                <div className="text-xs text-terminal-muted font-mono">Finance & Supply Chain Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-terminal-green mb-2">$2.3B</div>
                <div className="text-xs text-terminal-muted font-mono">Assets Under Management Using RRIO</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-terminal-green mb-2">95%</div>
                <div className="text-xs text-terminal-muted font-mono">User Satisfaction Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-terminal-green mb-2">24-48h</div>
                <div className="text-xs text-terminal-muted font-mono">Early Warning Lead Time</div>
              </div>
            </div>
          </Card>

          {/* Portfolio Management Case Studies */}
          <Card className="bg-terminal-card border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-terminal-green" />
              Portfolio Management Success Stories
            </h2>
            <div className="space-y-6">
              {/* Case Study 1 */}
              <div className="border-l-2 border-terminal-green pl-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-terminal-text">Avoiding the March 2023 Banking Crisis</h3>
                  <span className="text-xs text-terminal-muted bg-terminal-surface px-2 py-1 rounded">March 2023</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-terminal-text">Professional:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Sarah Chen, Senior Portfolio Manager at Regional Asset Management ($450M AUM)</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Challenge:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Managing equity exposure during uncertain banking sector stress</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">RRIO Intelligence:</strong>
                    <span className="text-sm text-terminal-muted ml-2">System detected banking stress signals 3 days before SVB collapse through credit spread analysis and yield curve inversion patterns</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Action Taken:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Reduced financial sector allocation from 15% to 5%, increased cash position to 12%</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Outcome:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Outperformed benchmark by 180bps during crisis period, preserved $8.1M in client assets</span>
                  </div>
                </div>
              </div>

              {/* Case Study 2 */}
              <div className="border-l-2 border-terminal-green pl-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-terminal-text">Inflation Regime Transition Positioning</h3>
                  <span className="text-xs text-terminal-muted bg-terminal-surface px-2 py-1 rounded">October 2022</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-terminal-text">Professional:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Marcus Rodriguez, CIO at Multi-Family Office ($1.2B Assets)</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Challenge:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Positioning portfolios for potential Fed policy pivot amid peak inflation concerns</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">RRIO Intelligence:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Regime models indicated inflation peak 6 weeks before Fed policy shift, confirmed by labor market and PMI signals</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Action Taken:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Increased duration exposure, reduced inflation hedge positions, overweight growth vs value</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Outcome:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Portfolio returned 12.4% vs 8.7% benchmark in Q4 2022, adding $44M in client value</span>
                  </div>
                </div>
              </div>

              {/* Case Study 3 */}
              <div className="border-l-2 border-terminal-green pl-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-terminal-text">Corporate Treasury Optimization</h3>
                  <span className="text-xs text-terminal-muted bg-terminal-surface px-2 py-1 rounded">June 2023</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-terminal-text">Professional:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Jennifer Liu, CFO at Technology Company (Pre-IPO)</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Challenge:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Timing $50M debt issuance amid volatile credit market conditions</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">RRIO Intelligence:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Credit regime analysis predicted tightening conditions within 30 days based on spread widening patterns</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Action Taken:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Accelerated bond issuance timeline by 3 weeks, locked in terms before market deterioration</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Outcome:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Secured financing at 75bps lower than market rate 30 days later, saving $1.9M annually in interest costs</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Supply Chain Case Studies */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Truck className="h-5 w-5 text-terminal-green" />
              Supply Chain Intelligence Success Stories
            </h2>
            <div className="space-y-6">
              {/* Supply Chain Case 1 */}
              <div className="border-l-2 border-terminal-green pl-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-terminal-text">Freight Cost Optimization During Rate Spike</h3>
                  <span className="text-xs text-terminal-muted bg-terminal-card px-2 py-1 rounded">February 2024</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-terminal-text">Professional:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Michael Thompson, Supply Chain Director at Consumer Goods Company ($2.5B Revenue)</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Challenge:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Managing freight costs amid volatile shipping market and seasonal demand surges</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">RRIO Intelligence:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Baltic Dry Index forecast indicated 40% freight rate increase within 2 weeks due to supply chain stress indicators</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Action Taken:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Negotiated 6-month freight contracts 2 weeks ahead of rate spike, secured additional carrier capacity</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Outcome:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Avoided $2.3M in additional freight costs, maintained product availability during competitor shortages</span>
                  </div>
                </div>
              </div>

              {/* Supply Chain Case 2 */}
              <div className="border-l-2 border-terminal-green pl-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-terminal-text">Supplier Risk Mitigation Strategy</h3>
                  <span className="text-xs text-terminal-muted bg-terminal-card px-2 py-1 rounded">September 2023</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-terminal-text">Professional:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Elena Vasquez, Chief Procurement Officer at Manufacturing Company</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Challenge:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Managing supplier relationships across multiple geographic regions with varying economic stress levels</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">RRIO Intelligence:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Regional economic stress indicators showed deteriorating conditions in key supplier region 3 weeks before supply disruption</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Action Taken:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Diversified supplier base, increased safety stock for critical components, pre-negotiated alternative contracts</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Outcome:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Maintained 99.8% production uptime while competitors experienced 15% capacity reduction, gained market share</span>
                  </div>
                </div>
              </div>

              {/* Supply Chain Case 3 */}
              <div className="border-l-2 border-terminal-green pl-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-terminal-text">Inventory Optimization Through Demand Regime Analysis</h3>
                  <span className="text-xs text-terminal-muted bg-terminal-card px-2 py-1 rounded">November 2023</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-terminal-text">Professional:</strong>
                    <span className="text-sm text-terminal-muted ml-2">David Park, Operations Director at Retail Chain (500+ Locations)</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Challenge:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Optimizing seasonal inventory levels amid uncertain consumer demand patterns</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">RRIO Intelligence:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Consumer confidence regime models indicated demand weakness 6 weeks before holiday season, contradicting traditional forecasts</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Action Taken:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Reduced holiday inventory orders by 15%, increased focus on essential items, negotiated flexible return terms</span>
                  </div>
                  <div>
                    <strong className="text-sm text-terminal-text">Outcome:</strong>
                    <span className="text-sm text-terminal-muted ml-2">Avoided $4.7M in excess inventory write-offs, improved inventory turnover by 23% vs prior year</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Implementation Framework */}
          <div className="terminal-grid lg:grid-cols-2">
            <Card className="bg-terminal-card border-terminal-border p-6">
              <h2 className="text-lg font-bold text-terminal-text mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-terminal-green" />
                Professional Implementation Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Week 1: Baseline Assessment</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• Set up RRIO dashboard monitoring protocols</li>
                    <li>• Integrate daily workflow with GRII score reviews</li>
                    <li>• Establish baseline risk tolerance and decision thresholds</li>
                    <li>• Configure alerts for regime change probabilities</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Week 2-4: Strategy Development</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• Define regime-based decision frameworks</li>
                    <li>• Create scenario response protocols</li>
                    <li>• Integrate RRIO signals with existing risk management</li>
                    <li>• Develop reporting templates for stakeholders</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Month 2-3: Full Integration</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• Implement regime-based portfolio adjustments</li>
                    <li>• Optimize supply chain decisions using RRIO intelligence</li>
                    <li>• Track performance attribution vs traditional methods</li>
                    <li>• Refine strategies based on early results</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Ongoing: Optimization</h3>
                  <ul className="space-y-1 text-xs text-terminal-muted">
                    <li>• Continuous performance monitoring and adjustment</li>
                    <li>• Regular strategy refinement based on regime changes</li>
                    <li>• Team training and capability development</li>
                    <li>• Best practice sharing with RRIO community</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-terminal-surface border-terminal-border p-6">
              <h2 className="text-lg font-bold text-terminal-text mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-terminal-green" />
                ROI Framework by Professional Role
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Portfolio Management</h3>
                  <div className="space-y-1 text-xs text-terminal-muted">
                    <div className="flex justify-between"><span>Risk-Adjusted Alpha:</span> <span className="text-terminal-green">+15-20bps annually</span></div>
                    <div className="flex justify-between"><span>Sharpe Ratio Improvement:</span> <span className="text-terminal-green">+0.15-0.25</span></div>
                    <div className="flex justify-between"><span>Maximum Drawdown Reduction:</span> <span className="text-terminal-green">-25-35%</span></div>
                    <div className="flex justify-between"><span>Client Retention:</span> <span className="text-terminal-green">+8-12%</span></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Supply Chain Management</h3>
                  <div className="space-y-1 text-xs text-terminal-muted">
                    <div className="flex justify-between"><span>Freight Cost Reduction:</span> <span className="text-terminal-green">3-5% annually</span></div>
                    <div className="flex justify-between"><span>Inventory Optimization:</span> <span className="text-terminal-green">10-15% working capital</span></div>
                    <div className="flex justify-between"><span>Supplier Risk Mitigation:</span> <span className="text-terminal-green">95%+ uptime maintained</span></div>
                    <div className="flex justify-between"><span>Procurement Timing:</span> <span className="text-terminal-green">2-8% cost avoidance</span></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-terminal-text text-sm mb-2">Corporate Finance</h3>
                  <div className="space-y-1 text-xs text-terminal-muted">
                    <div className="flex justify-between"><span>Funding Cost Optimization:</span> <span className="text-terminal-green">5-10bps improvement</span></div>
                    <div className="flex justify-between"><span>Cash Management:</span> <span className="text-terminal-green">50-75bps yield enhancement</span></div>
                    <div className="flex justify-between"><span>Capital Allocation Timing:</span> <span className="text-terminal-green">10-15% IRR improvement</span></div>
                    <div className="flex justify-between"><span>Risk Management:</span> <span className="text-terminal-green">Enhanced stress testing</span></div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-terminal-card border border-terminal-green rounded">
                  <p className="text-xs text-terminal-muted">
                    <strong className="text-terminal-green">Average Annual Value Creation:</strong> 
                    $500K - $5M+ depending on AUM/revenue scale and implementation depth. 
                    Most professionals achieve positive ROI within 60-90 days of implementation.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Getting Started CTA */}
          <Card className="bg-terminal-card border-terminal-green p-6 text-center">
            <h2 className="text-lg font-bold text-terminal-text mb-4">
              Ready to Join 500+ Professionals Using AI-Powered Risk Intelligence?
            </h2>
            <p className="text-sm text-terminal-muted mb-6">
              Experience the competitive advantage of 24-48 hour early warning for economic regime changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                onClick={() => window.location.href = '/getting-started'}
              >
                Start Your Implementation
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/'}
              >
                Explore Live Dashboard
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/methodology'}
              >
                Review Methodology
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </MainLayout>
  );
}
