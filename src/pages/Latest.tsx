
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import toolsData from "@/data/tools.json";

const Latest = () => {
  // For now, we'll just show the featured tools
  // In a real app, this would be sorted by date
  const latestTools = toolsData.featured;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest Tools</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latestTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Latest;
