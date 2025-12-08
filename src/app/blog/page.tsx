"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
import PagePrimer from "@/components/ui/PagePrimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Rss } from "lucide-react";

const categories = [
  "Risk Analysis",
  "Economic Intelligence", 
  "Technology",
  "Market Insights",
  "Methodology",
  "Case Studies"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeatured, setShowFeatured] = useState(false);

  return (
    <MainLayout>
      <div className="px-6 py-6">
        <div className="space-y-8">
          {/* Header */}
          <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                Content Hub
              </p>
              <h1 className="text-2xl font-bold uppercase text-terminal-text">
                RRIO Blog & Insights
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.open("https://medium.com/@rrio-observatory", "_blank")}
                className="bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA] hover:bg-[#00D4AA] hover:text-black font-mono text-sm"
              >
                <Rss className="h-4 w-4 mr-2" />
                Medium Blog
              </Button>
            </div>
          </header>

          {/* Page Primer */}
          <PagePrimer
            title="Blog & Research Insights"
            description="In-depth analysis, methodological insights, and research findings from the RRIO Observatory team. Our blog covers risk intelligence, economic analysis, AI applications in finance, and platform development insights."
            inputs={[
              "Research findings from GRII analysis",
              "Platform usage insights and case studies", 
              "Methodological developments and improvements",
              "Economic intelligence and market analysis",
              "Technical innovations in risk modeling"
            ]}
            process={[
              "Content creation and peer review process",
              "SEO optimization for research discovery",
              "Multi-platform publishing (Medium, LinkedIn)",
              "Community engagement and feedback collection",
              "Impact measurement and analytics tracking"
            ]}
            outputs={[
              "Educational blog posts and tutorials",
              "Research methodology explanations",
              "Platform feature deep-dives", 
              "Economic analysis and market insights",
              "Technical documentation and guides"
            ]}
            expandable={true}
          />

          {/* Filters */}
          <Card className="bg-black border-[#00D4AA] border-2 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#00D4AA]" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-[#00D4AA] text-[#00D4AA] pl-10 pr-4 py-2 rounded font-mono text-sm focus:border-[#39FF14] focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-black border border-[#00D4AA] text-[#00D4AA] px-3 py-2 rounded font-mono text-sm focus:border-[#39FF14] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <Button
                  onClick={() => setShowFeatured(!showFeatured)}
                  variant={showFeatured ? "default" : "outline"}
                  size="sm"
                  className={`font-mono text-sm ${
                    showFeatured 
                      ? "bg-[#39FF14] text-black border-[#39FF14]" 
                      : "border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-black"
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Featured
                </Button>
              </div>
            </div>
          </Card>

          {/* Featured Posts Section */}
          {!selectedCategory && !showFeatured && (
            <div>
              <h2 className="text-[#39FF14] font-mono font-bold text-lg mb-4">
                Featured Posts
              </h2>
              <BlogList 
                featured={true}
                limit={3}
                showViewAll={false}
              />
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-[#39FF14] font-mono font-bold text-lg mb-4">
              {selectedCategory ? `${selectedCategory} Posts` : showFeatured ? "Featured Posts" : "Recent Posts"}
            </h2>
            <BlogList 
              category={selectedCategory || undefined}
              featured={showFeatured}
              limit={20}
              showViewAll={false}
            />
          </div>

          {/* SEO Content */}
          <Card className="bg-black border-[#00D4AA]/30 border p-6">
            <h3 className="text-[#39FF14] font-mono font-bold text-sm mb-3">
              ABOUT RRIO INSIGHTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#00D4AA] font-mono text-sm">
              <div>
                <h4 className="text-[#00D4AA] font-bold mb-2">Research Focus</h4>
                <p className="leading-relaxed">
                  Our blog provides deep insights into global risk intelligence, 
                  economic analysis methodologies, and advanced financial modeling techniques. 
                  We share research findings, platform developments, and industry analysis.
                </p>
              </div>
              <div>
                <h4 className="text-[#00D4AA] font-bold mb-2">Target Audience</h4>
                <p className="leading-relaxed">
                  Written for analysts, researchers, policymakers, and financial professionals 
                  interested in risk intelligence, economic forecasting, and advanced 
                  analytical methodologies for decision-making.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}