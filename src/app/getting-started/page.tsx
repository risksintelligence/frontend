"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, TrendingUp, Truck, Calculator, Clock, CheckCircle, ArrowRight, BookOpen } from "lucide-react";

export default function GettingStartedPage() {
  return (
    <MainLayout>
      <main className="px-6 py-6">
        <div className="space-y-8">
          {/* Header */}
          <header>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">
              AI Risk Intelligence Quick Start
            </p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">
              Getting Started with RRIO for Finance & Supply Chain Professionals
            </h1>
            <p className="text-sm text-terminal-muted mt-2">
              Step-by-step implementation guides designed for portfolio managers, supply chain directors, and risk professionals seeking competitive advantage.
            </p>
          </header>

          {/* Quick Start Overview */}
          <PagePrimer
            title="RRIO Quick Start Framework"
            description="Professional implementation pathway designed to deliver value within 60-90 days through systematic adoption of AI-powered risk intelligence."
            expandable={true}
            items={[
              {
                title: "5-Minute Daily Routine",
                content: "Morning risk assessment using GRII score, regime probabilities, and key driver analysis.",
                tooltip: "Essential daily workflow used by 500+ finance and supply chain professionals",
                expandedContent: "Start each day with a 5-minute RRIO assessment: Check GRII score movements (>5 points signals attention), review regime probabilities for any shifts >10%, identify top 3 risk drivers, and review 24-hour forecast trends. This routine provides early warning context for all strategic decisions throughout the day."
              },
              {
                title: "Weekly Strategic Integration",
                content: "15-minute deep dive into trend analysis, scenario planning, and portfolio/operational adjustments.",
                tooltip: "Professional best practices for maximizing RRIO intelligence value",
                expandedContent: "Weekly analysis includes historical trend review over 30-90 day periods, stress testing current positions against forecast scenarios, explainability report review for attribution analysis, and strategy refinement based on regime change patterns. This systematic approach ensures continuous optimization of risk-adjusted decision making."
              },
              {
                title: "Role-Specific Implementation",
                content: "Customized workflows for portfolio management, supply chain optimization, and corporate finance teams.",
                tooltip: "Proven frameworks delivering measurable ROI across professional disciplines",
                expandedContent: "Portfolio managers focus on regime-based allocation timing and risk budgeting. Supply chain directors emphasize freight cost optimization and supplier risk assessment. Corporate finance teams prioritize debt issuance timing and cash management. Each role has specific metrics, decision frameworks, and success benchmarks tailored to professional objectives."
              }
            ]}
          />

          {/* Role Selection */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Play className="h-5 w-5 text-terminal-green" />
              Choose Your Professional Quick Start Guide
            </h2>
            <div className="terminal-grid lg:grid-cols-3 gap-6">
              <Card className="bg-terminal-card border-terminal-border p-4 hover:border-terminal-green transition-colors cursor-pointer">
                <TrendingUp className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Portfolio Management</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Asset allocation timing, risk budgeting, and regime-based investment strategies for portfolio managers and investment teams.
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                  onClick={() => document.getElementById('portfolio-guide')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Portfolio Guide
                </Button>
              </Card>

              <Card className="bg-terminal-card border-terminal-border p-4 hover:border-terminal-green transition-colors cursor-pointer">
                <Truck className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Supply Chain Management</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Freight optimization, inventory planning, and supplier risk management for operations and supply chain professionals.
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                  onClick={() => document.getElementById('supply-chain-guide')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Supply Chain Guide
                </Button>
              </Card>

              <Card className="bg-terminal-card border-terminal-border p-4 hover:border-terminal-green transition-colors cursor-pointer">
                <Calculator className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Corporate Finance</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Debt issuance timing, cash management, and capital allocation optimization for CFOs and treasury teams.
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                  onClick={() => document.getElementById('corporate-finance-guide')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Finance Guide
                </Button>
              </Card>
            </div>
          </Card>

          {/* Portfolio Management Guide */}
          <Card className="bg-terminal-card border-terminal-border p-6" id="portfolio-guide">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-terminal-green" />
              Portfolio Management Quick Start Guide
            </h2>
            
            <div className="space-y-6">
              {/* Daily Routine */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-terminal-green" />
                  Daily Morning Routine (5 minutes)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <strong className="text-sm text-terminal-text">GRII Score Assessment</strong>
                      <p className="text-xs text-terminal-muted">Check current score vs yesterday. Movements {'>'}5 points require attention. Score {'>'}60 indicates elevated regime risk.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Regime Probabilities</strong>
                      <p className="text-xs text-terminal-muted">Review current regime classification. Shifts {'>'}10% probability indicate potential transition requiring position review.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Top 3 Risk Drivers</strong>
                      <p className="text-xs text-terminal-muted">Identify primary factors moving risk score: VIX spikes, credit spread widening, yield curve changes, or PMI deterioration.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <strong className="text-sm text-terminal-text">24-Hour Forecast</strong>
                      <p className="text-xs text-terminal-muted">Review Monte Carlo projections. Tail risk {'>'}5% probability warrants defensive positioning.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Framework */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Portfolio Decision Framework</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Low Risk Regime (GRII 0-39)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Increase risk budget by 10-20%</li>
                        <li>• Overweight growth vs value</li>
                        <li>• Extend duration positioning</li>
                        <li>• Reduce hedging costs</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-terminal-surface border border-yellow-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Moderate Risk Regime (GRII 40-59)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Maintain neutral allocations</li>
                        <li>• Balance growth/value exposure</li>
                        <li>• Moderate duration positioning</li>
                        <li>• Selective hedging implementation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-orange-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">High Risk Regime (GRII 60-79)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Reduce risk budget by 15-25%</li>
                        <li>• Overweight defensive sectors</li>
                        <li>• Shorten duration exposure</li>
                        <li>• Increase hedging coverage</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-terminal-surface border border-red-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Critical Risk Regime (GRII 80+)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Maximum defensive positioning</li>
                        <li>• Increase cash allocation 20%+</li>
                        <li>• Implement tail risk hedges</li>
                        <li>• Prepare for opportunity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Review */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Weekly Deep Dive (15 minutes)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Historical trend analysis (30-90 day patterns)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Portfolio stress testing using forecast scenarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Explainability report review for performance attribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Strategy refinement based on regime change effectiveness</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Supply Chain Guide */}
          <Card className="bg-terminal-surface border-terminal-border p-6" id="supply-chain-guide">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Truck className="h-5 w-5 text-terminal-green" />
              Supply Chain Management Quick Start Guide
            </h2>
            
            <div className="space-y-6">
              {/* Daily Routine */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-terminal-green" />
                  Daily Operations Check (3 minutes)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Baltic Dry Index Trend</strong>
                      <p className="text-xs text-terminal-muted">Monitor freight cost indicators. Sharp increases ({'>'}5% daily) suggest securing capacity urgently.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Oil Price Momentum</strong>
                      <p className="text-xs text-terminal-muted">Track WTI trends for transportation cost impact. Rising oil affects fuel surcharges within 1-2 weeks.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Regional Economic Stress</strong>
                      <p className="text-xs text-terminal-muted">Check stress indicators for key supplier regions. High stress (GRII {'>'}60) indicates supplier risk.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Framework */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Supply Chain Decision Framework</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-card border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Stable Conditions (GRII 0-39)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Optimize inventory to lean levels</li>
                        <li>• Negotiate longer-term contracts</li>
                        <li>• Pursue cost reduction initiatives</li>
                        <li>• Evaluate new supplier relationships</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-terminal-card border border-orange-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Rising Stress (GRII 60+)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Increase safety stock levels</li>
                        <li>• Secure freight capacity early</li>
                        <li>• Diversify supplier base</li>
                        <li>• Implement contingency plans</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-card border border-yellow-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Freight Optimization Strategy</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Baltic Dry {'>'}2000: Lock contracts immediately</li>
                        <li>• Oil {'>'}$80: Negotiate fuel hedge options</li>
                        <li>• GRII rising: Book capacity 2-3 weeks ahead</li>
                        <li>• Economic stress: Consider modal shifts</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-terminal-card border border-red-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Supplier Risk Management</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Regional GRII {'>'}60: Assess alternatives</li>
                        <li>• Credit stress rising: Secure inventory</li>
                        <li>• PMI falling: Diversify geography</li>
                        <li>• Monitor financial health indicators</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Planning */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Monthly Strategic Planning (30 minutes)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Inventory level optimization based on demand regime analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Supplier risk assessment by geographic region and sector</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Freight budget forecasting using transport cost models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Contingency plan updates based on stress test scenarios</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Corporate Finance Guide */}
          <Card className="bg-terminal-card border-terminal-border p-6" id="corporate-finance-guide">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-terminal-green" />
              Corporate Finance Quick Start Guide
            </h2>
            
            <div className="space-y-6">
              {/* Daily Routine */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-terminal-green" />
                  Daily Treasury Review (5 minutes)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Credit Spread Analysis</strong>
                      <p className="text-xs text-terminal-muted">Monitor corporate credit spreads. Widening {'>'}10bps indicates tightening conditions for debt issuance.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Yield Curve Positioning</strong>
                      <p className="text-xs text-terminal-muted">Track 10Y-2Y spread for rate environment assessment. Inversion signals potential economic transition.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-terminal-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <strong className="text-sm text-terminal-text">Liquidity Conditions</strong>
                      <p className="text-xs text-terminal-muted">Review financial conditions index. Tightening liquidity affects funding costs and availability.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance Framework */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Corporate Finance Decision Framework</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Favorable Conditions (GRII 0-39)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Opportunistic debt issuance</li>
                        <li>• Extend debt maturity profiles</li>
                        <li>• Accelerate growth investments</li>
                        <li>• Optimize cash management yield</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-terminal-surface border border-orange-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Tightening Conditions (GRII 60+)</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Preserve liquidity and cash</li>
                        <li>• Delay non-essential financing</li>
                        <li>• Review covenant compliance</li>
                        <li>• Prepare contingency facilities</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-yellow-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Debt Issuance Timing</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Spreads tightening: Accelerate timing</li>
                        <li>• Credit stress rising: Issue immediately</li>
                        <li>
                          • GRII {'>'}70: Delay unless critical
                        </li>
                        <li>• Favorable regime: Lock long-term rates</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-terminal-surface border border-red-500 rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Cash Management Strategy</h4>
                      <ul className="text-xs text-terminal-muted space-y-1">
                        <li>• Risk rising: Increase liquidity buffer</li>
                        <li>• Rate environment: Optimize duration</li>
                        <li>• Credit stress: Reduce counterparty risk</li>
                        <li>• Opportunity preparation: Build dry powder</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quarterly Review */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Quarterly Strategic Review (45 minutes)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Capital allocation optimization based on regime forecasts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Debt maturity ladder review and refinancing planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Credit facility utilization and covenant compliance monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-terminal-green" />
                    <span className="text-sm text-terminal-muted">Investment policy review based on economic intelligence</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Implementation Success Metrics */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6">Implementation Success Metrics</h2>
            <div className="terminal-grid lg:grid-cols-3">
              <div className="space-y-3">
                <h3 className="font-semibold text-terminal-text text-sm">30-Day Milestones</h3>
                <div className="space-y-2 text-xs text-terminal-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Daily RRIO routine established</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Decision thresholds defined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Baseline performance metrics captured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Team training completed</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-terminal-text text-sm">60-Day Objectives</h3>
                <div className="space-y-2 text-xs text-terminal-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>First regime-based decisions executed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Performance attribution analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Strategy refinement based on results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>ROI measurement framework</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-terminal-text text-sm">90-Day Success Targets</h3>
                <div className="space-y-2 text-xs text-terminal-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Measurable performance improvement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Full workflow integration achieved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Stakeholder reporting established</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-terminal-green" />
                    <span>Positive ROI demonstration</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="bg-terminal-card border-terminal-green p-6 text-center">
            <h2 className="text-lg font-bold text-terminal-text mb-4">
              Ready to Start Your RRIO Implementation?
            </h2>
            <p className="text-sm text-terminal-muted mb-6">
              Join 500+ professionals using AI-powered risk intelligence for competitive advantage in volatile markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                onClick={() => window.location.href = '/'}
              >
                Access Live Dashboard
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/use-cases'}
              >
                Review Success Stories
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/methodology'}
              >
                Study Methodology
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </MainLayout>
  );
}
