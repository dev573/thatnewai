
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import toolsData from "@/data/tools.json";

const Category = () => {
  const { id } = useParams();
  const category = toolsData.categories.find(c => c.id === id);
  const toolsInCategory = toolsData.featured.filter(tool => 
    tool.categories.some(cat => 
      cat.toLowerCase() === category?.name.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category?.name || "Category"}
        </h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {toolsInCategory.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
