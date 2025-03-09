import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MDEditor from '@uiw/react-md-editor';
import { Upload } from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";

interface PostFormData {
  title: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  type: "free" | "paid" | "freemium" | "freemium";
  thumbnails: Record<string, string>;
  slug: string;
  logo?: string;
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
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    name: "",
    category: "",
    description: "",
    tags: [],
    type: "free",
    thumbnails: {},
    slug: "",
    logo: ""
  });

  useEffect(() => {

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tool Logo/Image
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  {previewImage ? (
                    <div className="relative w-24 h-24 mb-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  )}
                  <p className="text-sm text-gray-600">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 100x100px
                  </p>
                </label>
              </div>
            </div>
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

export default PostForm;
