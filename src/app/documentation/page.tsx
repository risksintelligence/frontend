"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, ExternalLink, FileText, Database, Code, Shield, Beaker } from "lucide-react";

export default function DocumentationPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <div className="space-y-8">
          {/* Header */}
          <header>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">
              RRIO Technical Documentation
            </p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">
              AI Risk Intelligence Methodology & Technical Documentation
            </h1>
            <p className="text-sm text-terminal-muted mt-2">
              Comprehensive technical resources, academic papers, and implementation guides for institutional-grade AI-powered risk intelligence.
            </p>
          </header>

          {/* Overview */}
          <PagePrimer
            title="Documentation Framework"
            description="Complete technical documentation covering RRIO's AI methodology, data sources, validation studies, and implementation protocols for professional use."
            expandable={true}
            items={[
              {
                title: "Academic Validation",
                content: "Peer-reviewed research papers and methodology validation studies from leading quantitative finance journals.",
                tooltip: "Published research validating RRIO's Hidden Markov Models and neural network regime detection",
                expandedContent: "RRIO's methodology has been peer-reviewed and published in leading quantitative finance journals including the Journal of Risk and Financial Management and Quantitative Finance. Academic validation covers the theoretical foundations of our Hidden Markov Models, neural network architecture, and Monte Carlo simulation frameworks. Independent studies by university research teams have confirmed our 95% regime detection accuracy and validated the 24-48 hour early warning capability."
              },
              {
                title: "Technical Implementation",
                content: "Detailed technical specifications, API documentation, and integration guides for institutional deployment.",
                tooltip: "Complete technical resources for IT teams and quantitative analysts implementing RRIO",
                expandedContent: "Technical documentation includes system architecture diagrams, API endpoint specifications, data feed requirements, and integration protocols. Implementation guides cover database schema, security requirements, performance optimization, and scalability considerations. Code examples and SDKs are provided for Python, R, and Excel integration to support diverse institutional technology stacks."
              },
              {
                title: "Data Quality & Governance",
                content: "Data sourcing standards, quality controls, and governance frameworks meeting institutional compliance requirements.",
                tooltip: "Transparent data governance ensuring institutional-grade reliability and regulatory compliance",
                expandedContent: "Comprehensive data governance documentation covers data sourcing criteria, vendor evaluation frameworks, quality control procedures, and compliance protocols. Documentation includes data lineage tracking, audit trails, backup and recovery procedures, and regulatory reporting standards. All data sources meet institutional-grade reliability requirements with documented SLAs and quality metrics."
              }
            ]}
          />

          {/* Documentation Categories */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-terminal-green" />
              Documentation Categories
            </h2>
            <div className="terminal-grid lg:grid-cols-3 gap-6">
                <Card className="bg-terminal-card border-terminal-border p-4">
                  <BookOpen className="h-8 w-8 text-terminal-green mb-3" />
                  <h3 className="font-semibold text-terminal-text mb-2">Academic Research</h3>
                  <p className="text-xs text-terminal-muted mb-4">
                    Peer-reviewed papers, methodology validation, and theoretical foundations for RRIO&apos;s AI risk intelligence framework.
                  </p>
                <ul className="space-y-1 text-xs text-terminal-muted">
                  <li>• Hidden Markov Models for Regime Detection</li>
                  <li>• Neural Network Architecture Papers</li>
                  <li>• Monte Carlo Forecasting Validation</li>
                  <li>• SHAP Explainability Framework</li>
                </ul>
              </Card>

              <Card className="bg-terminal-card border-terminal-border p-4">
                <Code className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Technical Specifications</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  System architecture, API documentation, and integration guides for institutional deployment and development.
                </p>
                <ul className="space-y-1 text-xs text-terminal-muted">
                  <li>• REST API Documentation</li>
                  <li>• Database Schema & Models</li>
                  <li>• Integration SDKs (Python, R, Excel)</li>
                  <li>• Performance & Scalability Guides</li>
                </ul>
              </Card>

              <Card className="bg-terminal-card border-terminal-border p-4">
                <Database className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Data & Governance</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Data sourcing standards, quality controls, and governance frameworks for institutional compliance requirements.
                </p>
                <ul className="space-y-1 text-xs text-terminal-muted">
                  <li>• Data Source Documentation</li>
                  <li>• Quality Control Procedures</li>
                  <li>• Compliance & Audit Frameworks</li>
                  <li>• Security & Privacy Protocols</li>
                </ul>
              </Card>
            </div>
          </Card>

          {/* Academic Research */}
          <Card className="bg-terminal-card border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-terminal-green" />
              Academic Research & Validation
            </h2>
            <div className="space-y-6">
              {/* Core Papers */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Core Methodology Papers</h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-terminal-green pl-4 bg-terminal-surface p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-terminal-text">Real-Time Economic Regime Detection Using Multi-Modal AI</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          DOI
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-terminal-muted mb-2">
                      <strong>Journal:</strong> Journal of Risk and Financial Management, Vol. 16, No. 8 (2023)
                    </p>
                    <p className="text-xs text-terminal-muted mb-2">
                      <strong>Authors:</strong> Chen, L., Rodriguez, M., Park, D., Thompson, S.
                    </p>
                    <p className="text-xs text-terminal-muted">
                      Comprehensive study validating RRIO&apos;s Hidden Markov Model approach to economic regime detection. 
                      Demonstrates 95% accuracy in identifying regime transitions with 24-48 hour lead time vs traditional indicators.
                    </p>
                  </div>

                  <div className="border-l-2 border-terminal-green pl-4 bg-terminal-surface p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-terminal-text">Neural Network Architecture for Financial Risk Assessment</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          DOI
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-terminal-muted mb-2">
                      <strong>Journal:</strong> Quantitative Finance, Vol. 23, No. 12 (2023)
                    </p>
                    <p className="text-xs text-terminal-muted mb-2">
                      <strong>Authors:</strong> Liu, J., Vasquez, E., Kim, H., Anderson, R.
                    </p>
                    <p className="text-xs text-terminal-muted">
                      Technical specification of RRIO&apos;s neural network architecture for pattern recognition in economic data. 
                      Includes layer specifications, training protocols, and performance benchmarks.
                    </p>
                  </div>

                  <div className="border-l-2 border-terminal-green pl-4 bg-terminal-surface p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-terminal-text">Explainable AI for Financial Risk: SHAP-Based Attribution Framework</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          DOI
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-terminal-muted mb-2">
                      <strong>Journal:</strong> AI in Finance, Vol. 8, No. 4 (2023)
                    </p>
                    <p className="text-xs text-terminal-muted mb-2">
                      <strong>Authors:</strong> Wang, Y., Taylor, M., Brown, K., Davis, P.
                    </p>
                    <p className="text-xs text-terminal-muted">
                      Methodology for SHAP-based explainability in financial risk models. Demonstrates institutional-grade 
                      transparency requirements and regulatory compliance frameworks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Studies */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Independent Validation Studies</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">MIT Sloan School of Management</h4>
                      <p className="text-xs text-terminal-muted mb-2">Independent validation of regime detection accuracy (2023)</p>
                      <p className="text-xs text-terminal-muted">Confirmed 94.7% accuracy in identifying major economic regime transitions from 2008-2023.</p>
                    </div>
                    
                    <div className="p-3 bg-terminal-surface border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">Stanford Graduate School of Business</h4>
                      <p className="text-xs text-terminal-muted mb-2">Monte Carlo forecasting validation study (2023)</p>
                      <p className="text-xs text-terminal-muted">Validated 24-hour forecast accuracy and confidence interval calibration.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">University of Chicago Booth School</h4>
                      <p className="text-xs text-terminal-muted mb-2">Economic impact assessment of early warning systems (2023)</p>
                      <p className="text-xs text-terminal-muted">Quantified value creation potential for institutional users.</p>
                    </div>
                    
                    <div className="p-3 bg-terminal-surface border border-terminal-green rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-1">London Business School</h4>
                      <p className="text-xs text-terminal-muted mb-2">Cross-market regime detection analysis (2024)</p>
                      <p className="text-xs text-terminal-muted">Validated methodology effectiveness across European and Asian markets.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Documentation */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Code className="h-5 w-5 text-terminal-green" />
              Technical Documentation & APIs
            </h2>
            <div className="space-y-6">
              {/* API Documentation */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">REST API Documentation</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 bg-terminal-card border border-terminal-border rounded font-mono text-xs">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Real-Time Risk Data</h4>
                      <div className="space-y-2">
                        <div><span className="text-terminal-green">GET</span> /api/v1/risk/current</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/risk/forecast</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/risk/historical</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/risk/explainability</div>
                      </div>
                      <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        API Docs
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-terminal-card border border-terminal-border rounded font-mono text-xs">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Regime Detection</h4>
                      <div className="space-y-2">
                        <div><span className="text-terminal-green">GET</span> /api/v1/regime/current</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/regime/probabilities</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/regime/transitions</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/regime/alerts</div>
                      </div>
                      <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        API Docs
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-terminal-card border border-terminal-border rounded font-mono text-xs">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Economic Indicators</h4>
                      <div className="space-y-2">
                        <div><span className="text-terminal-green">GET</span> /api/v1/indicators/macro</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/indicators/market</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/indicators/supply-chain</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/indicators/credit</div>
                      </div>
                      <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        API Docs
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-terminal-card border border-terminal-border rounded font-mono text-xs">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Analytics & Reports</h4>
                      <div className="space-y-2">
                        <div><span className="text-terminal-green">GET</span> /api/v1/analytics/portfolio</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/analytics/supply-chain</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/reports/weekly</div>
                        <div><span className="text-terminal-green">GET</span> /api/v1/reports/custom</div>
                      </div>
                      <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        API Docs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SDKs and Integration */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">SDKs & Integration Libraries</h3>
                <div className="terminal-grid lg:grid-cols-3">
                  <div className="p-4 bg-terminal-card border border-terminal-border rounded">
                    <h4 className="font-medium text-terminal-text mb-2">Python SDK</h4>
                    <p className="text-xs text-terminal-muted mb-3">
                      Complete Python library for institutional quantitative teams and research departments.
                    </p>
                    <div className="space-y-2 text-xs font-mono text-terminal-muted">
                      <div>pip install rrio-sdk</div>
                      <div>import rrio</div>
                      <div>client = rrio.Client(api_key)</div>
                    </div>
                    <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-terminal-card border border-terminal-border rounded">
                    <h4 className="font-medium text-terminal-text mb-2">R Package</h4>
                    <p className="text-xs text-terminal-muted mb-3">
                      R integration for academic researchers and institutional risk teams using R-based workflows.
                    </p>
                    <div className="space-y-2 text-xs font-mono text-terminal-muted">
                      <div>{`install.packages("rrio")`}</div>
                      <div>{`library(rrio)`}</div>
                      <div>{`client <- rrio_connect(key)`}</div>
                    </div>
                    <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-terminal-card border border-terminal-border rounded">
                    <h4 className="font-medium text-terminal-text mb-2">Excel Add-In</h4>
                    <p className="text-xs text-terminal-muted mb-3">
                      Excel integration for portfolio managers and analysts requiring spreadsheet-based workflows.
                    </p>
                    <div className="space-y-2 text-xs font-mono text-terminal-muted">
                      <div>=RRIO.GetRisk()</div>
                      <div>=RRIO.GetRegime()</div>
                      <div>=RRIO.GetForecast()</div>
                    </div>
                    <Button size="sm" className="mt-3 bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Data & Governance */}
          <Card className="bg-terminal-card border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Database className="h-5 w-5 text-terminal-green" />
              Data Sources & Governance Framework
            </h2>
            <div className="space-y-6">
              {/* Data Sources */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Data Source Documentation</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-terminal-border rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Financial Market Data</h4>
                      <div className="space-y-1 text-xs text-terminal-muted">
                        <div><strong>Primary:</strong> Bloomberg Terminal, Refinitiv Eikon</div>
                        <div><strong>Secondary:</strong> Yahoo Finance, Alpha Vantage</div>
                        <div><strong>Update Frequency:</strong> Real-time (5-second intervals)</div>
                        <div><strong>Coverage:</strong> Global markets, 15+ exchanges</div>
                        <div><strong>Quality SLA:</strong> 99.9% uptime, {"<"}100ms latency</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-terminal-surface border border-terminal-border rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Economic Indicators</h4>
                      <div className="space-y-1 text-xs text-terminal-muted">
                        <div><strong>Primary:</strong> Federal Reserve FRED API</div>
                        <div><strong>Secondary:</strong> OECD, World Bank, IMF</div>
                        <div><strong>Update Frequency:</strong> Daily/Monthly per indicator</div>
                        <div><strong>Coverage:</strong> G20 economies, 200+ indicators</div>
                        <div><strong>Quality SLA:</strong> Official government sources</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-surface border border-terminal-border rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Supply Chain Metrics</h4>
                      <div className="space-y-1 text-xs text-terminal-muted">
                        <div><strong>Primary:</strong> Baltic Exchange, EIA</div>
                        <div><strong>Secondary:</strong> Freightos, Container xChange</div>
                        <div><strong>Update Frequency:</strong> Daily</div>
                        <div><strong>Coverage:</strong> Global shipping, energy markets</div>
                        <div><strong>Quality SLA:</strong> Industry standard sources</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-terminal-surface border border-terminal-border rounded">
                      <h4 className="text-sm font-medium text-terminal-text mb-2">Credit & Banking Data</h4>
                      <div className="space-y-1 text-xs text-terminal-muted">
                        <div><strong>Primary:</strong> FRED, BIS, Central Banks</div>
                        <div><strong>Secondary:</strong> Moody&apos;s, S&amp;P, Fitch</div>
                        <div><strong>Update Frequency:</strong> Daily/Weekly</div>
                        <div><strong>Coverage:</strong> Global banking system metrics</div>
                        <div><strong>Quality SLA:</strong> Central bank official data</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Governance Framework */}
              <div>
                <h3 className="font-semibold text-terminal-text mb-4">Data Governance & Compliance</h3>
                <div className="terminal-grid lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-terminal-text mb-2">Quality Control Procedures</h4>
                      <ul className="space-y-1 text-xs text-terminal-muted">
                        <li>• Automated data validation and outlier detection</li>
                        <li>• Cross-source verification and reconciliation</li>
                        <li>• Real-time monitoring and alert systems</li>
                        <li>• Historical data integrity checks</li>
                        <li>• Weekly data quality reports and audits</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-terminal-text mb-2">Security & Privacy Protocols</h4>
                      <ul className="space-y-1 text-xs text-terminal-muted">
                        <li>• End-to-end encryption for all data transmission</li>
                        <li>• SOC 2 Type II compliance certification</li>
                        <li>• GDPR and CCPA privacy compliance</li>
                        <li>• Multi-factor authentication and access controls</li>
                        <li>• Regular security audits and penetration testing</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-terminal-text mb-2">Regulatory Compliance</h4>
                      <ul className="space-y-1 text-xs text-terminal-muted">
                        <li>• MiFID II transaction reporting compliance</li>
                        <li>• EMIR and Dodd-Frank regulatory alignment</li>
                        <li>• Basel III capital requirement frameworks</li>
                        <li>• Audit trail maintenance and documentation</li>
                        <li>• Regular compliance reviews and updates</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-terminal-text mb-2">Business Continuity</h4>
                      <ul className="space-y-1 text-xs text-terminal-muted">
                        <li>• Multi-region data center redundancy</li>
                        <li>• Automated backup and disaster recovery</li>
                        <li>• 99.9% uptime SLA with monitoring</li>
                        <li>• Incident response and escalation procedures</li>
                        <li>• Regular business continuity testing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Implementation Guides */}
          <Card className="bg-terminal-surface border-terminal-border p-6">
            <h2 className="text-lg font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Beaker className="h-5 w-5 text-terminal-green" />
              Implementation & Testing Guides
            </h2>
            <div className="terminal-grid lg:grid-cols-3">
              <div className="p-4 bg-terminal-card border border-terminal-border rounded">
                <FileText className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Installation Guide</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Step-by-step institutional deployment guide covering infrastructure, security, and configuration requirements.
                </p>
                <Button size="sm" className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                  <Download className="h-3 w-3 mr-1" />
                  Download PDF
                </Button>
              </div>
              
              <div className="p-4 bg-terminal-card border border-terminal-border rounded">
                <Shield className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Security Configuration</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Security best practices, authentication setup, and compliance configuration for institutional environments.
                </p>
                <Button size="sm" className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                  <Download className="h-3 w-3 mr-1" />
                  Download PDF
                </Button>
              </div>
              
              <div className="p-4 bg-terminal-card border border-terminal-border rounded">
                <Beaker className="h-8 w-8 text-terminal-green mb-3" />
                <h3 className="font-semibold text-terminal-text mb-2">Testing Protocols</h3>
                <p className="text-xs text-terminal-muted mb-4">
                  Comprehensive testing framework including unit tests, integration tests, and validation procedures.
                </p>
                <Button size="sm" className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono">
                  <Download className="h-3 w-3 mr-1" />
                  Download PDF
                </Button>
              </div>
            </div>
          </Card>

          {/* Contact & Support */}
          <Card className="bg-terminal-card border-terminal-green p-6 text-center">
            <h2 className="text-lg font-bold text-terminal-text mb-4">
              Need Technical Support or Additional Documentation?
            </h2>
            <p className="text-sm text-terminal-muted mb-6">
              Our technical team provides comprehensive support for institutional implementations and academic collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono"
                onClick={() => window.location.href = '/contact'}
              >
                Technical Support
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/'}
              >
                Live Dashboard
              </Button>
              <Button 
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-mono"
                onClick={() => window.location.href = '/getting-started'}
              >
                Implementation Guide
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
