import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit2, Trash2, ArrowUpDown } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  short_description: string;
  logo: string;
  rating: number;
  pricing_type: string;
  created_at: string;
  website_url?: string;
}

interface Post {
  video_id: string;
  title: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  type: "free" | "paid" | "freemium" | "freemium";
  thumbnails: Record<string, string>;
  processed_at: { $date: string };
  slug: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Post>("processed_at");
  const [toolSortField, setToolSortField] = useState<keyof Tool>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/backdoor");
      return;
    }

    const fetchData = async () => {
      try {
        const [postsResponse, toolsResponse] = await Promise.all([
          fetch("/api/admin/inventions"),
          fetch("/api/admin/tools")
        ]);
        const [postsData, toolsData] = await Promise.all([
          postsResponse.json(),
          toolsResponse.json()
        ]);
        setPosts(postsData);
        setTools(toolsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  const handleSort = (field: keyof Post | keyof Tool, isToolSort: boolean = false) => {
    if (isToolSort) {
      if (field === toolSortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setToolSortField(field as keyof Tool);
        setSortDirection("asc");
      }
    } else {
      if (field === sortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field as keyof Post);
        setSortDirection("asc");
      }
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      // TODO: Replace with actual API call
      await fetch(`/api/admin/inventions/${slug}`, { method: "DELETE" });
      setPosts(posts.filter(post => post.slug !== slug));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortField === "processed_at") {
      return sortDirection === "asc"
        ? new Date(a.processed_at.$date).getTime() - new Date(b.processed_at.$date).getTime()
        : new Date(b.processed_at.$date).getTime() - new Date(a.processed_at.$date).getTime();
    }
    return sortDirection === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            onClick={() => navigate("/admin/posts/new")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Post
          </Button>
        </div>

        <div className="space-y-8">
        </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">AI Tools</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logo
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name", true)}
                    >
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("pricing_type", true)}
                    >
                      <div className="flex items-center">
                        Pricing
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("created_at", true)}
                    >
                      <div className="flex items-center">
                        Created At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tools.map((tool) => (
                    <tr key={tool.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{tool.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {tool.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tool.pricing_type === "Free" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {tool.pricing_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(tool.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/tools/${tool.slug}/edit`)}
                          className="text-purple-600 hover:text-purple-900 mr-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tool.slug)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </main>
    </div>
  );
};

export default AdminDashboard;