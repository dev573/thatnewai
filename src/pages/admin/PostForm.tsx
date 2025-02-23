import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostFormData {
  title: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  type: "free" | "paid" | "freemium" | "freemium";
  thumbnails: Record<string, string>;
  slug: string;
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

const PostForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    name: "",
    category: "",
    description: "",
    tags: [],
    type: "free",
    thumbnails: {},
    slug: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/backdoor");
      return;
    }

    if (slug) {
      // Fetch existing post data if editing
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/admin/inventions/${slug}`);
          const data = await response.json();
          setFormData(data);
          setTagsInput(data.tags.join(", ")); // Initialize tags input
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch post data",
            variant: "destructive",
          });
          navigate("/admin/dashboard");
        }
      };
      fetchPost();
    }
  }, [slug, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData = {
        ...formData,
        processed_at: { $date: new Date().toISOString() },
        slug: generateSlug(formData.title),
      };

      const url = slug
        ? `/api/admin/inventions/${slug}`
        : "/api/admin/inventions";

      const method = slug ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("Failed to save post");

      toast({
        title: "Success",
        description: `Post ${slug ? "updated" : "created"} successfully`,
      });

      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {slug ? "Edit" : "Add New"} AI Invention Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                const newSlug = generateSlug(title);
                setFormData({ ...formData, title, name: title, slug: newSlug });
              }}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="mt-1"
              placeholder="your-post-slug"
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
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                  }}
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1"
              rows={6}
            />
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

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : slug ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostForm;
