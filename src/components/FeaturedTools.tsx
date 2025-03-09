
import { useEffect, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { Tool, getTools } from "@/lib/api";
import { Button } from "./ui/button";
import { LoaderFull } from "./ui/loader";

export const FeaturedTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(9);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await getTools(currentPage, perPage);
        setTools(response.data);
        setTotalPages(response.total_pages);
        setError(null);
      } catch (err) {
        setError('Failed to load tools. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [currentPage, perPage]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Tools</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover the most popular AI tools used by professionals
            </p>
          </div>
          <LoaderFull text="Loading featured tools..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600">Error</h2>
            <p className="mt-4 text-lg text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Featured Tools</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover the most popular AI tools used by professionals
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};
