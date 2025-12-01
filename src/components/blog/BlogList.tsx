"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, ExternalLink, Star } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string | null;
  category: string;
  tags: string[];
  reading_time_minutes: number | null;
  view_count: number;
  is_featured: boolean;
}

interface BlogListProps {
  category?: string;
  featured?: boolean;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export default function BlogList({
  category,
  featured = false,
  limit = 10,
  showViewAll = true,
  className = ""
}: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [category, featured, limit]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: limit.toString(),
        published_only: "true"
      });
      
      if (category) params.append("category", category);
      if (featured) params.append("featured_only", "true");

      const response = await fetch(`/api/v1/blog/posts?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const trackBlogClick = async (slug: string) => {
    // Track blog post click
    try {
      await fetch("/api/v1/blog/track-engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: slug,
          action: "click",
          metadata: { source: "blog_list" }
        }),
      });
    } catch (error) {
      // Silent fail
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Draft";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-black border-[#00D4AA] border-2 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-[#00D4AA]/20 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-[#00D4AA]/20 rounded mb-2 w-full"></div>
              <div className="h-4 bg-[#00D4AA]/20 rounded mb-4 w-2/3"></div>
              <div className="flex items-center gap-4">
                <div className="h-4 bg-[#00D4AA]/20 rounded w-20"></div>
                <div className="h-4 bg-[#00D4AA]/20 rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`bg-black border-red-500 border-2 p-6 ${className}`}>
        <p className="text-red-400 font-mono">Error loading blog posts: {error}</p>
        <Button 
          onClick={fetchPosts}
          className="mt-4 bg-red-500/20 text-red-400 border border-red-500 hover:bg-red-500 hover:text-white font-mono"
        >
          Retry
        </Button>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className={`bg-black border-[#00D4AA] border-2 p-6 ${className}`}>
        <p className="text-[#00D4AA] font-mono text-center">
          No blog posts found{category ? ` in ${category}` : ""}.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className={`bg-black border-2 p-6 hover:border-[#39FF14] transition-colors ${
            post.is_featured ? "border-[#39FF14]" : "border-[#00D4AA]"
          }`}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {post.is_featured && (
                    <Star className="h-4 w-4 text-[#39FF14] fill-[#39FF14]" />
                  )}
                  <span className="text-xs font-mono text-[#00D4AA] uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#39FF14] mb-3 hover:text-[#39FF14]/80 transition-colors">
                  <Link 
                    href={`/blog/${post.slug}`}
                    onClick={() => trackBlogClick(post.slug)}
                  >
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-[#00D4AA] font-mono text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#00D4AA]/20 text-[#00D4AA] text-xs font-mono rounded border border-[#00D4AA]/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#00D4AA]/20">
              <div className="flex items-center gap-4 text-xs text-[#00D4AA] font-mono">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{post.author_name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                
                {post.reading_time_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.reading_time_minutes} min read</span>
                  </div>
                )}
                
                <span className="text-[#00D4AA]/60">
                  {post.view_count} views
                </span>
              </div>
              
              <Link
                href={`/blog/${post.slug}`}
                onClick={() => trackBlogClick(post.slug)}
                className="flex items-center gap-2 text-[#39FF14] hover:text-[#39FF14]/80 transition-colors font-mono text-sm"
              >
                Read More
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Card>
      ))}
      
      {showViewAll && posts.length >= limit && (
        <div className="text-center">
          <Button
            asChild
            className="bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA] hover:bg-[#00D4AA] hover:text-black font-mono"
          >
            <Link href="/blog">
              View All Blog Posts
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}