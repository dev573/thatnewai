import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { getToolBySlug } from "@/lib/api";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from "../../hooks/useAuth";

interface ToolFormData {
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

export default function EditToolForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<ToolFormData>({
    name: "",
    category: "",
    description: "",
    tags: [],
    type: "free",
    resource_url: "",
    featured: false
  });

  useEffect(() => {

    if (!slug) {
      toast({
        title: "Error",
        description: "No tool slug provided",
        variant: "destructive",
      });
      navigate("/admin/dashboard", { replace: false });
      return;
    }

    // Fetch existing tool data
    const fetchTool = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching tool with slug:", slug);
        
        // First try to get the tool directly from the API
        try {
          const response = await api.get(`/tools/${slug}`);
          console.log("Direct API response:", response.data);
          
          // If we get a direct response, map it to our form data
          const item = response.data;
          if (item && item.id) {
            const toolData = {
              name: item.name || '',
              category: Array.isArray(item.categories) ? item.categories[0] : 
                       typeof item.category === 'string' ? item.category : '',
              description: item.description || item.short_description || '',
              tags: Array.isArray(item.categories) ? item.categories : 
                   typeof item.category === 'string' ? [item.category] : [],
              type: (item.type === 'free' ? 'free' : 
                    item.type === 'freemium' ? 'freemium' : 
                    item.type === 'paid' ? 'paid' : 'free') as "free" | "paid" | "freemium",
              resource_url: item.resource_url || item.website_url || '',
              featured: item.featured || false
            };
            
            setFormData(toolData);
            setTagsInput(toolData.tags.join(", "));
            setIsLoading(false);
            return;
          }
        } catch (directApiError) {
          console.error("Error fetching directly from API:", directApiError);
          // Continue to try with getToolBySlug
        }
        
        // If direct API call fails, try with our getToolBySlug function
        const tool = await getToolBySlug(slug);
        console.log("getToolBySlug response:", tool);
        
        if (tool && tool.id) {
          setFormData({
            name: tool.name || '',
            category: tool.categories && tool.categories.length > 0 ? tool.categories[0] : '',
            description: tool.short_description || '',
            tags: tool.categories || [],
            type: (tool.pricing_type.toLowerCase() === 'free' ? 'free' : 
                  tool.pricing_type.toLowerCase() === 'freemium' ? 'freemium' : 
                  tool.pricing_type.toLowerCase() === 'paid' ? 'paid' : 'free') as "free" | "paid" | "freemium",
            resource_url: tool.website_url || '',
            featured: false
          });
          setTagsInput(tool.categories.join(", "));
        } else {
          throw new Error("Invalid tool data received");
        }
      } catch (error) {
        console.error("Error in fetchTool:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tool data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [navigate, slug, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.patch(`/tools/${slug}`, formData);

      toast({
        title: "Success",
        description: "Tool updated successfully",
      });

      navigate("/admin/dashboard", { replace: false });
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mt-10">
            Edit Tool
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Update tool information and details
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-4 text-gray-600">Loading tool data...</p>
              </div>
            ) : (
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
                    {isLoading ? "Updating..." : "Update Tool"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
