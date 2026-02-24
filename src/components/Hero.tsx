import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Article, searchNews } from "@/services/newsApi";
import { Loader } from "./ui/loader";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoading(true);
        try {
          const response = await searchNews(searchQuery, 1, 5);
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setIsLoading(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(e);
  };

  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto pt-28 pb-4 px-4 sm:pt-32 sm:pb-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="block text-sm font-semibold text-purple-600 tracking-wide uppercase animate-fade-in">
            AI News Aggregator
          </span>
          <h1 className="mt-1 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
            Your Guide to the Latest
            <span className="block text-purple-600">AI Technologies</span>
          </h1>
          <p className="mt-2 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl animate-fade-in">
            Stay ahead with curated news from 23+ sources — research papers, model releases, open source, and more.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-4xl mx-auto relative animate-fade-in">
            <div className="relative flex items-center">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search AI news..."
                className="h-14 pl-12 pr-32 w-full rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
              />
              <Search className="absolute left-4 text-gray-400" size={24} />
              <Button
                type="submit"
                className="absolute right-2 h-10 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-lg font-medium"
              >
                Search
              </Button>
            </div>

            {isLoading && searchQuery.trim().length > 1 && (
              <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-6">
                <Loader size="md" text="Searching AI news..." />
              </div>
            )}

            {!isLoading && showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 divide-y divide-gray-100">
                {suggestions.map((article) => (
                  <button
                    key={article._id}
                    type="button"
                    onClick={() => {
                      setShowSuggestions(false);
                      navigate(`/news/${article.slug || article._id}`);
                    }}
                    className="w-full text-left flex items-center space-x-4 p-4 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-900 truncate hover:text-purple-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {article.source} &middot; {article.category}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-50 to-white -z-10" />
    </div>
  );
};
