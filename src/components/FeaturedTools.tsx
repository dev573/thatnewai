
import toolsData from "@/data/tools.json";
import { ToolCard } from "./ToolCard";

export const FeaturedTools = () => {
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
          {toolsData.featured.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};
