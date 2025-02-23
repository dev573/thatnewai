
import { Navbar } from "@/components/Navbar";
import { Brain, Image, Mic, Video, Code, Rocket } from "lucide-react";
import toolsData from "@/data/tools.json";
import { Footer } from "@/components/Footer";

const iconMap: { [key: string]: any } = {
  "Language Model": Brain,
  "Image Generation": Image,
  "Audio and Speech": Mic,
  "Video Generation": Video,
  "Development": Code,
  "Productivity": Rocket,
  "AI Tools": Brain,
  "AI Automation": Rocket,
  "AI Agent Framework": Code,
  "AI Agent": Brain
};

const Categories = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">AI Tool Categories</h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse our comprehensive collection of AI tools by category
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {toolsData.categories.map((category) => {
            const IconComponent = iconMap[category.name] || Rocket;
            const toolsInCategory = toolsData.featured.filter(tool =>
              tool.categories.some(cat => cat.toLowerCase() === category.name.toLowerCase())
            );
            
            return (
              <a
                key={category.id}
                href={`/category/${category.id.toLowerCase()}`}
                className="group relative bg-white/50 backdrop-blur-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <IconComponent className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{category.count} tools</p>
                  </div>
                </div>

                {toolsInCategory.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-gray-500">Popular tools:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {toolsInCategory.slice(0, 2).map((tool) => (
                        <span
                          key={tool.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                        >
                          {tool.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
