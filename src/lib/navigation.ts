import { 
  LayoutDashboard, 
  Shield, 
  TrendingUp, 
  Brain, 
  Network, 
  Calculator, 
  Database, 
  Activity,
  Wifi,
  Globe,
  Zap,
  Settings,
  TestTube
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  description: string;
  icon?: any;
}

export interface NavGroup {
  title: string;
  icon: any;
  items: NavItem[];
}

export interface NavigationStructure {
  dashboard: {
    title: string;
    href: string;
    icon: any;
    description: string;
  };
  groups: NavGroup[];
}

export const navigationStructure: NavigationStructure = {
  // Main Dashboard
  dashboard: {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Executive overview and key metrics"
  },

  // Feature Groups
  groups: [
    {
      title: "Risk Intelligence",
      icon: Shield,
      items: [
        { name: "Risk Overview", href: "/risk", description: "Executive risk dashboard" },
        { name: "Risk Factors", href: "/risk/factors", description: "Detailed factor analysis" },
        { name: "Risk Methodology", href: "/risk/methodology", description: "Calculation methods" },
        { name: "Risk History", href: "/risk/history", description: "Historical trends" },
        { name: "Risk Alerts", href: "/risk/alerts", description: "Active alerts" }
      ]
    },
    {
      title: "Analytics & Intelligence",
      icon: TrendingUp,
      items: [
        { name: "Economic Intelligence", href: "/analytics/economic", description: "Economic indicators" },
        { name: "Predictions & Forecasts", href: "/analytics/predictions", description: "ML forecasting" },
        { name: "Scenario Analysis", href: "/analytics/scenarios", description: "What-if modeling" },
        { name: "Trend Analysis", href: "/analytics/trends", description: "Statistical trends" },
        { name: "Correlations", href: "/analytics/correlations", description: "Factor correlations" }
      ]
    },
    {
      title: "ML Explainability",
      icon: Brain,
      items: [
        { name: "Explainability Overview", href: "/explainability", description: "ML explainability dashboard" },
        { name: "SHAP Analysis", href: "/explainability/shap", description: "Model explanations" },
        { name: "Model Performance", href: "/explainability/performance", description: "Accuracy metrics" },
        { name: "Bias Detection", href: "/explainability/bias", description: "Fairness analysis" },
        { name: "Feature Importance", href: "/explainability/features", description: "Feature rankings" },
        { name: "Model Comparison", href: "/explainability/comparison", description: "Model comparisons" },
        { name: "Prediction Explanations", href: "/explainability/predictions", description: "Individual predictions" }
      ]
    },
    {
      title: "Network Analysis",
      icon: Network,
      items: [
        { name: "Network Overview", href: "/network", description: "Topology dashboard" },
        { name: "Centrality Analysis", href: "/network/centrality", description: "Node importance" },
        { name: "Vulnerability Assessment", href: "/network/vulnerabilities", description: "Weak points" },
        { name: "Critical Paths", href: "/network/critical-paths", description: "Key connections" },
        { name: "Shock Simulation", href: "/network/simulation", description: "Impact modeling" },
        { name: "Supply Chain", href: "/network/supply-chain", description: "Supply chain networks" },
        { name: "Infrastructure", href: "/network/infrastructure", description: "Infrastructure dependencies" }
      ]
    },
    {
      title: "Simulation & Modeling",
      icon: Calculator,
      items: [
        { name: "Simulation Overview", href: "/simulation", description: "Simulation dashboard" },
        { name: "Monte Carlo", href: "/simulation/monte-carlo", description: "Statistical simulation" },
        { name: "Policy Analysis", href: "/simulation/policy", description: "Policy impact" },
        { name: "Scenario Templates", href: "/simulation/templates", description: "Reusable scenarios" },
        { name: "Stress Testing", href: "/simulation/stress", description: "System resilience" }
      ]
    },
    {
      title: "Data Management",
      icon: Database,
      items: [
        { name: "Data Overview", href: "/data", description: "Data management dashboard" },
        { name: "Data Sources", href: "/data/sources", description: "Source monitoring" },
        { name: "Data Quality", href: "/data/quality", description: "Quality metrics" },
        { name: "Data Export", href: "/data/export", description: "Export tools" },
        { name: "Data Lineage", href: "/data/lineage", description: "Data flow tracking" }
      ]
    },
    {
      title: "System Monitoring",
      icon: Activity,
      items: [
        { name: "Monitoring Overview", href: "/monitoring", description: "System monitoring dashboard" },
        { name: "System Health", href: "/monitoring/health", description: "Service status" },
        { name: "Performance", href: "/monitoring/performance", description: "System metrics" },
        { name: "Alerts", href: "/monitoring/alerts", description: "System alerts" },
        { name: "Audit Logs", href: "/monitoring/logs", description: "Activity logs" }
      ]
    },
    {
      title: "Real-Time Streaming",
      icon: Wifi,
      items: [
        { name: "WebSocket Dashboard", href: "/realtime", description: "Live data streaming and real-time updates" }
      ]
    },
    {
      title: "External Data Sources",
      icon: Globe,
      items: [
        { name: "Data Sources Management", href: "/external", description: "Monitor external API connections and data feeds" }
      ]
    },
    {
      title: "Cache Management",
      icon: Zap,
      items: [
        { name: "Intelligent Caching", href: "/cache", description: "Three-tier cache system monitoring and management" }
      ]
    },
    {
      title: "Model Training",
      icon: Brain,
      items: [
        { name: "ML Model Training", href: "/models", description: "Train and deploy machine learning models" }
      ]
    },
    {
      title: "Database Administration",
      icon: Database,
      items: [
        { name: "Database Management", href: "/database", description: "PostgreSQL database administration and monitoring" }
      ]
    },
    {
      title: "API Testing & Diagnostics",
      icon: TestTube,
      items: [
        { name: "API Diagnostics", href: "/diagnostics", description: "Test API endpoints and monitor system health" }
      ]
    }
  ]
};