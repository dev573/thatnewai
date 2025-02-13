
import { Icon } from "lucide-react";
import toolsData from "@/data/tools.json";
import { Brain, Image, Mic, Video, Code, Rocket } from "lucide-react";

const iconMap: { [key: string]: any } = {
  brain: Brain,
  image: Image,
  mic: Mic,
  video: Video,
  code: Code,
  rocket: Rocket,
};

export const CategoriesGrid = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore AI tools by category to find exactly what you need
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {toolsData.categories.map((category) => {
            const IconComponent = iconMap[category.icon];
            return (
              <a
                key={category.id}
                href={`/category/${category.id}`}
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
              </a>
            )
          })}
        </div>
      </div>
    </section>
  );
};
