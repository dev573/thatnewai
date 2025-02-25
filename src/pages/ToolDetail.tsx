
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Star, ExternalLink, Calendar } from "lucide-react";
import { Tool, getToolBySlug } from "@/lib/api";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/categoryIcons";

const ToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      if (!slug) return;
      try {
        const fetchedTool = await getToolBySlug(slug);
        setTool(fetchedTool);
        setError(null);
      } catch (err) {
        setError('Failed to load tool details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <h1 className="text-3xl font-bold text-gray-900">Loading tool details...</h1>
        </main>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <h1 className="text-3xl font-bold text-red-600">Error</h1>
          <p className="mt-4 text-lg text-gray-600">{error || 'Tool not found'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="space-y-8">
          <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <img
                src={tool.logo || '/placeholder.svg'}
                alt={tool.name}
                className="w-20 h-20 rounded-lg object-cover bg-white"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                    <div className="flex items-center mt-2 space-x-4">
                      {/* Rating display temporarily commented out
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-gray-600">{tool.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      */}
                      <span className="text-gray-600">{tool.pricing_type}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(tool.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {tool.website_url && (
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => window.open(tool.website_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.categories.map((category) => {
                    const IconComponent = getCategoryIcon(category);
                    return (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700"
                      >
                        <IconComponent className="w-4 h-4 mr-1.5" />
                        {category}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-6 text-gray-600 leading-relaxed">
              {tool.short_description ? (
                <div data-color-mode="light">
                  <MDEditor.Markdown source={tool.short_description} />
                </div>
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolDetail;
