import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import MDEditor from '@uiw/react-md-editor';
import { Upload } from 'lucide-react';

interface EditToolFormData {
  name: string;
  category: string;
  description: string;
  tags: string[];
  type: "free" | "paid" | "freemium";
  resource_url?: string;
  featured: boolean;
}

const CATEGORIES = [
  "LLM",
  "AI Agent Framework",
  "Tool",
  "Computer Vision",
  "Speech Recognition",
  "NLP",
  "Other"
];

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const EditToolForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<EditToolFormData>({
    name: "",
    category: "",
    description: "",
    tags: [],
    type: "free",
    resource_url: "",
    featured: false
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/backdoor");
      return;
    }

    if (slug) {
      const fetchTool = async () => {
        try {
          const response = await fetch(`/api/tools/${slug}`);
          if (!response.ok) throw new Error('Failed to fetch tool');
          
          const data = await response.json();
          setFormData({
            name: data.name,
            category: data.category,
            description: data.description,
            tags: data.tags,
            type: data.type,
            resource_url: data.resource_url,
            featured: data.featured
          });
          setTagsInput(data.tags.join(", "));
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch tool data",
            variant: "destructive",
          });
          navigate("/admin/dashboard");
        }
      };
      fetchTool();
    }
  }, [slug, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tools/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update tool');
      }

      toast({
        title: "Success",
        description: "Tool updated successfully",
      });

      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update tool",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                value={CATEGORIES.includes(formData.category) ? formData.category : "Other"}
                onValueChange={(value) => {
                  if (value === "Other") {
                    setFormData({ ...formData, category: "" });
                  } else {
                    setFormData({ ...formData, category: value });
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!CATEGORIES.includes(formData.category) && (
                <div className="mt-2">
                  <Input
                    placeholder="Enter custom category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Markdown)
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value || "" })}
                  preview="edit"
                  height={400}
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setTagsInput(value);
                  const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
                  setFormData(prev => ({ ...prev, tags }));
                }}
                placeholder="AI Agent, Automation, RAG"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value: "free" | "paid" | "freemium") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="resource_url" className="block text-sm font-medium text-gray-700">
                Resource URL
              </label>
              <Input
                id="resource_url"
                type="url"
                value={formData.resource_url || ''}
                onChange={(e) => setFormData({ ...formData, resource_url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Tool
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Update Tool"}
              </Button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="prose max-w-none" data-color-mode="light">
              <MDEditor.Markdown source={formData.description} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditToolForm;