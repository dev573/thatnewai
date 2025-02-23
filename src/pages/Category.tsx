
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { Tool, getToolsByCategory } from "@/lib/api";

const Category = () => {
  const { slug } = useParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      if (!slug) return;
      try {
        const data = await getToolsByCategory(slug);
        setTools(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tools. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <h2 className="text-3xl font-bold text-gray-900">Loading tools...</h2>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <h2 className="text-3xl font-bold text-red-600">Error</h2>
          <p className="mt-4 text-lg text-gray-600">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {tools[0]?.categories[0] || "Category"}
        </h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
