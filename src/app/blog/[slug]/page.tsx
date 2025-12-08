"use client";

import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import FeedbackWidget from "@/components/ui/FeedbackWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Clock, 
  User, 
  Share2, 
  ExternalLink,
  ArrowLeft,
  Linkedin
} from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_title: string;
  author_linkedin?: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_featured: boolean;
  category: string;
  tags: string[];
  meta_description?: string;
  featured_image_url?: string;
  reading_time_minutes?: number;
  view_count: number;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/blog/posts/${params.slug}`);
      
      if (response.status === 404) {
        notFound();
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }

      const data = await response.json();
      setPost(data);
      
      // Update page metadata
      if (typeof document !== "undefined") {
        document.title = `${data.title} - RRIO Blog`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", data.meta_description || data.excerpt);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  const trackPageView = useCallback(async () => {
    try {
      await fetch("/api/v1/blog/track-engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: params.slug,
          action: "view",
          metadata: { source: "blog_post_page" }
        }),
      });
    } catch {
      // Silent fail
    }
  }, [params.slug]);

  useEffect(() => {
    fetchPost();
    trackPageView();
  }, [fetchPost, trackPageView]);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    let shareUrl = "";
    switch (platform) {
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        return;
    }
    
    if (shareUrl) {
      // Track share event
      try {
        await fetch("/api/v1/blog/track-engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            post_slug: params.slug,
            action: "share",
            metadata: { platform }
          }),
        });
      } catch {
        // Silent fail
      }
      
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Draft";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="px-6 py-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <Card className="bg-black border-[#00D4AA] border-2 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-[#00D4AA]/20 rounded w-3/4"></div>
                <div className="h-4 bg-[#00D4AA]/20 rounded w-1/2"></div>
                <div className="h-4 bg-[#00D4AA]/20 rounded w-full"></div>
                <div className="h-4 bg-[#00D4AA]/20 rounded w-full"></div>
                <div className="h-4 bg-[#00D4AA]/20 rounded w-2/3"></div>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="px-6 py-6 max-w-4xl mx-auto">
          <Card className="bg-black border-red-500 border-2 p-6">
            <h1 className="text-red-400 font-mono font-bold text-xl mb-4">
              Error Loading Blog Post
            </h1>
            <p className="text-red-400 font-mono mb-4">
              {error || "Blog post not found"}
            </p>
            <Button asChild className="bg-red-500/20 text-red-400 border border-red-500 hover:bg-red-500 hover:text-white font-mono">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button 
            asChild 
            variant="outline"
            className="border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-black font-mono"
          >
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Article Header */}
          <Card className="bg-black border-[#39FF14] border-2 p-8">
            <div className="space-y-6">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#00D4AA] uppercase tracking-wide bg-[#00D4AA]/20 px-2 py-1 rounded">
                  {post.category}
                </span>
                {post.is_featured && (
                  <span className="text-xs font-mono text-[#39FF14] uppercase tracking-wide bg-[#39FF14]/20 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#39FF14] leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-[#00D4AA] font-mono leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author & Meta */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-[#00D4AA]/20">
                <div className="flex items-center gap-6 text-sm text-[#00D4AA] font-mono">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <span className="font-bold">{post.author_name}</span>
                      {post.author_title && (
                        <span className="text-[#00D4AA]/60 ml-2">• {post.author_title}</span>
                      )}
                    </div>
                    {post.author_linkedin && (
                      <a
                        href={post.author_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#39FF14] hover:text-[#39FF14]/80 ml-2"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>

                  {post.reading_time_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.reading_time_minutes} min read</span>
                    </div>
                  )}

                  <span className="text-[#00D4AA]/60">
                    {post.view_count} views
                  </span>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#00D4AA] font-mono">Share:</span>
                  <Button
                    onClick={() => handleShare("linkedin")}
                    size="sm"
                    className="bg-blue-600/20 text-blue-400 border border-blue-600 hover:bg-blue-600 hover:text-white font-mono text-xs"
                  >
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare("copy")}
                    size="sm"
                    className="bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA] hover:bg-[#00D4AA] hover:text-black font-mono text-xs"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <Card className="bg-black border-[#00D4AA] border-2 p-8">
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-[#00D4AA] font-mono leading-relaxed whitespace-pre-wrap"
                style={{ lineHeight: "1.7" }}
              >
                {post.content}
              </div>
            </div>
          </Card>

          {/* Tags */}
          {post.tags.length > 0 && (
            <Card className="bg-black border-[#00D4AA]/50 border p-6">
              <h3 className="text-[#39FF14] font-mono font-bold text-sm mb-3">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#00D4AA]/20 text-[#00D4AA] text-sm font-mono rounded border border-[#00D4AA]/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Inline Feedback */}
          <FeedbackWidget page={`blog-${params.slug}`} position="inline" />

          {/* Related Content */}
          <Card className="bg-black border-[#00D4AA]/30 border p-6">
            <h3 className="text-[#39FF14] font-mono font-bold text-sm mb-3">
              EXPLORE MORE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                asChild 
                variant="outline"
                className="border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-black font-mono"
              >
                <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                  More in {post.category}
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black font-mono"
              >
                <Link href="/">
                  Explore Platform
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
