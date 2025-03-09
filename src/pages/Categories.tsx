import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Brain, Image, Mic, Video, Code, Rocket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Category, getCategories } from "@/lib/api";
import { LoaderFull, SkeletonLoader } from "@/components/ui/loader";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
          setError(null);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">AI Tool Categories</h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse our comprehensive collection of AI tools by category
          </p>
        </div>

        {loading ? (
          <>
            <LoaderFull text="Loading AI tool categories..." variant="secondary" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8 opacity-60">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-white/50 rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gray-100">
                      <div className="w-6 h-6 rounded-md bg-gray-200"></div>
                    </div>
                    <SkeletonLoader className="w-full" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const IconComponent = iconMap[category.name] || Rocket;
              
              return (
                <a
                  key={category.id}
                  href={`/category/${category.slug || category.id}`}
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
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
