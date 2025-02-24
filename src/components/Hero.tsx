import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { SearchResult, searchTools } from "@/lib/api";
import SearchResultCard from "./SearchResultCard";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const response = await searchTools(searchQuery, 1, 5);
          setSuggestions(response.items);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Failed to fetch suggestions:', err);
          setSuggestions([]);
          setShowSuggestions(false);
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
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto pt-24 pb-4 px-4 sm:pt-28 sm:pb-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="block text-sm font-semibold text-purple-600 tracking-wide uppercase animate-fade-in">
            Discover AI Tools
          </span>
          <h1 className="mt-1 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
            Your Guide to the Latest
            <span className="block text-purple-600">AI Technologies</span>
          </h1>
          <p className="mt-2 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl animate-fade-in">
            Explore the newest AI tools and stay ahead with the latest innovations in artificial intelligence.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-4xl mx-auto relative animate-fade-in">
            <div className="relative flex items-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search AI tools..."
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
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 divide-y divide-gray-100">
              {suggestions.map((result) => (
                <SearchResultCard
                  key={result.id}
                  type={result.type}
                  id={result.id}
                  name={result.name}
                  description={result.description}
                  category={result.category}
                  date={result.date}
                  url={result.url}
                />
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
