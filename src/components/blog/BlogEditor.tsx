"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Eye, X } from "lucide-react";

interface BlogPost {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_title: string;
  author_linkedin?: string;
  category: string;
  tags: string[];
  meta_description?: string;
  featured_image_url?: string;
  is_featured: boolean;
}

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => Promise<void>;
  onCancel: () => void;
  categories: string[];
}

export default function BlogEditor({ 
  post, 
  onSave, 
  onCancel, 
  categories 
}: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>(
    post || {
      title: "",
      excerpt: "",
      content: "",
      author_name: "",
      author_title: "",
      author_linkedin: "",
      category: "",
      tags: [],
      meta_description: "",
      featured_image_url: "",
      is_featured: false,
    }
  );
  const [tagsInput, setTagsInput] = useState(formData.tags.join(", "));
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof BlogPost, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
    handleInputChange("tags", tags);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Failed to save blog post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#39FF14] mb-2">{formData.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[#00D4AA] font-mono mb-4">
          <span>By {formData.author_name}</span>
          <span>•</span>
          <span>{formData.author_title}</span>
          <span>•</span>
          <span>{formData.category}</span>
        </div>
        <p className="text-[#00D4AA] text-lg mb-6">{formData.excerpt}</p>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <div 
          className="text-[#00D4AA] whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formData.content }}
        />
      </div>
      
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] text-sm font-mono rounded border border-[#39FF14]/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderEditor = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14]"
            placeholder="Enter blog post title"
          />
        </div>
        
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full bg-black border border-[#00D4AA] text-[#00D4AA] p-2 rounded font-mono text-sm focus:border-[#39FF14] focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-[#00D4AA] text-sm font-mono mb-2">
          Excerpt *
        </label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => handleInputChange("excerpt", e.target.value)}
          className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14] resize-none"
          rows={3}
          placeholder="Brief description of the blog post"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-[#00D4AA] text-sm font-mono mb-2">
          Content *
        </label>
        <Textarea
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14] resize-none"
          rows={20}
          placeholder="Write your blog post content here..."
        />
      </div>

      {/* Author Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            Author Name *
          </label>
          <Input
            value={formData.author_name}
            onChange={(e) => handleInputChange("author_name", e.target.value)}
            className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14]"
            placeholder="Author name"
          />
        </div>
        
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            Author Title
          </label>
          <Input
            value={formData.author_title}
            onChange={(e) => handleInputChange("author_title", e.target.value)}
            className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14]"
            placeholder="Job title/role"
          />
        </div>
        
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            LinkedIn Profile
          </label>
          <Input
            value={formData.author_linkedin || ""}
            onChange={(e) => handleInputChange("author_linkedin", e.target.value)}
            className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14]"
            placeholder="LinkedIn URL"
          />
        </div>
      </div>

      {/* Tags and Meta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            Tags (comma-separated)
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => handleTagsChange(e.target.value)}
            className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14]"
            placeholder="risk, analytics, AI"
          />
        </div>
        
        <div>
          <label className="block text-[#00D4AA] text-sm font-mono mb-2">
            Featured Image URL
          </label>
          <Input
            value={formData.featured_image_url || ""}
            onChange={(e) => handleInputChange("featured_image_url", e.target.value)}
            className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14]"
            placeholder="Image URL"
          />
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-[#00D4AA] text-sm font-mono mb-2">
          Meta Description
        </label>
        <Textarea
          value={formData.meta_description || ""}
          onChange={(e) => handleInputChange("meta_description", e.target.value)}
          className="bg-black border-[#00D4AA] text-[#00D4AA] font-mono focus:border-[#39FF14] resize-none"
          rows={2}
          placeholder="SEO meta description"
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-[#00D4AA] font-mono text-sm">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => handleInputChange("is_featured", e.target.checked)}
            className="accent-[#39FF14]"
          />
          Featured Post
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="bg-black border-2 border-[#39FF14] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#39FF14] text-xl font-mono font-bold">
            {post ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsPreview(!isPreview)}
              variant="outline"
              size="sm"
              className="border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-black font-mono"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.content || isSaving}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/80 font-mono font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white font-mono"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        {/* Content */}
        {isPreview ? renderPreview() : renderEditor()}
      </Card>
    </div>
  );
}
