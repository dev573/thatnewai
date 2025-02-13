
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Star } from "lucide-react";
import toolsData from "@/data/tools.json";

const ToolDetail = () => {
  const { id } = useParams();
  const tool = toolsData.featured.find(t => t.id === id);

  if (!tool) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <h1 className="text-3xl font-bold text-gray-900">Tool not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start space-x-6">
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-gray-600">{tool.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{tool.pricing_type}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 leading-relaxed">
            {tool.short_description}
          </p>
        </div>
      </main>
    </div>
  );
};

export default ToolDetail;
