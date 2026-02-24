import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryStat, fetchCategories } from "@/services/newsApi";
import { LoaderFull } from "./ui/loader";
import {
  Brain,
  FileText,
  Wrench,
  Rocket,
  Github,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  models: Brain,
  papers: FileText,
  tools: Wrench,
  startups: Rocket,
  opensource: Github,
  researchers: GraduationCap,
};

export const CategoriesGrid = () => {
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <p className="mt-4 text-lg text-gray-600">Explore AI news by category</p>
          </div>
          <LoaderFull text="Loading categories..." variant="secondary" />
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
          <p className="mt-4 text-lg text-gray-600">Explore AI news by category</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.category] || Brain;
            return (
              <button
                key={cat.category}
                onClick={() =>
                  navigate(`/ai-news?category=${encodeURIComponent(cat.category)}`)
                }
                className="group relative bg-white/50 backdrop-blur-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden p-6 text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors capitalize">
                      {cat.category}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{cat.count} articles</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
