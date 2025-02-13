
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import toolsData from "@/data/tools.json";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const filteredTools = toolsData.featured.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.short_description.toLowerCase().includes(query.toLowerCase()) ||
    tool.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Results for "{query}"
        </h1>
        {filteredTools.length === 0 ? (
          <p className="text-gray-600">No tools found matching your search.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
