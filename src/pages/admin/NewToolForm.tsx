import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MDEditor from '@uiw/react-md-editor';

interface NewToolFormData {
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

export default function NewToolForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<NewToolFormData>({
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
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug: generateSlug(formData.name)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tool');
      }

      toast({
        title: "Success",
        description: "Tool created successfully",
      });

      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tool",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-6 mt-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Tool
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Share a new AI tool with the community
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-10"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <SelectTrigger className="h-10">
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
                        className="h-10"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="mb-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <div data-color-mode="light" className="border rounded-lg">
                      <MDEditor
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value || "" })}
                        preview="edit"
                        height={300}
                        className="border-none"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="min-h-[300px] border rounded-lg p-4 bg-white">
                    <div className="prose max-w-none" data-color-mode="light">
                      <MDEditor.Markdown source={formData.description} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="h-10"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "free" | "paid" | "freemium") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="resource_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Resource URL
                </label>
                <Input
                  id="resource_url"
                  type="url"
                  value={formData.resource_url || ''}
                  onChange={(e) => setFormData({ ...formData, resource_url: e.target.value })}
                  placeholder="https://example.com"
                  className="h-10"
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

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Tool"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
