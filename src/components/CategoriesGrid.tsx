
import React, { useEffect, useState } from "react";
import { Category, getCategories } from "@/lib/api";
import { getCategoryIcon } from "@/lib/categoryIcons";

export const CategoriesGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
          setError(null);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Loading categories...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600">Error</h2>
            <p className="mt-4 text-lg text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

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
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            return (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative bg-white/50 backdrop-blur-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    {IconComponent && <IconComponent className="w-6 h-6 text-purple-600" />}
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
      </div>
    </section>
  );
};
