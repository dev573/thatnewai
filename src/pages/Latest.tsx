import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tool, getTools } from "@/lib/api";
import { LoaderFull, SkeletonLoader } from "@/components/ui/loader";

const TOOLS_PER_PAGE = 9;

const Latest = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await getTools(currentPage, TOOLS_PER_PAGE);
        setTools(response.data);
        setTotalPages(response.total_pages);
        setError(null);
      } catch (err) {
        setError("Failed to load tools. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Latest Tools</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover the newest AI tools added to our collection
          </p>
        </div>

        {loading ? (
          <>
            <LoaderFull text="Loading latest AI tools..." />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8 opacity-50">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 shadow-sm">
                  <SkeletonLoader className="w-full h-48" />
                </div>
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p className="text-lg">{error}</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={currentPage === page ? "bg-purple-600" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Latest;
