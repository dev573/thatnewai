
import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getCategoryIcon } from "@/lib/categoryIcons";

interface ToolCardProps {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  short_description: string;
  logo: string;
  rating: number;
  pricing_type: string;
  className?: string;
}

export const ToolCard = ({
  id,
  slug,
  name,
  categories,
  short_description,
  logo,
  rating,
  pricing_type,
  className,
}: ToolCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tool/${slug}`)}
      className={cn(
        "group relative bg-white/50 backdrop-blur-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {logo && logo !== '/placeholder.svg' ? (
              <img
                src={logo}
                alt={name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  // If image fails to load, set src to empty to trigger the fallback
                  e.currentTarget.src = '';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                {categories && categories.length > 0 ? (
                  <div className="text-purple-600">
                    {React.createElement(getCategoryIcon(categories[0]), { className: "w-6 h-6" })}
                  </div>
                ) : (
                  <div className="text-purple-600 text-lg font-bold">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                {name}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                {/* Rating display temporarily commented out
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">{rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                */}
                <span className="text-sm text-gray-600">{pricing_type}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600 line-clamp-2">{short_description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category);
            return (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
              >
                <IconComponent className="w-3 h-3 mr-1" />
                {category}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
