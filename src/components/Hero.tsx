import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { SearchResult, searchTools } from "@/lib/api";

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

          <form onSubmit={handleSearch} className="mt-4 max-w-2xl mx-auto animate-fade-in relative">
            <div className="relative flex items-center">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search AI tools..."
                className="h-12 pl-12 pr-24 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <Search className="absolute left-4 text-gray-400" size={20} />
              <Button 
                type="submit"
                className="absolute right-2 h-9 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Search
              </Button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {suggestions.map((result) => (
                  <div
                    key={result.id}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                    onClick={() => {
                      setShowSuggestions(false);
                      navigate(result.url);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${result.type === 'tool' ? 'bg-purple-100' : 'bg-green-100'}`}>
                        <span className={`text-xs font-medium ${result.type === 'tool' ? 'text-purple-800' : 'text-green-800'}`}>
                          {result.type === 'tool' ? 'T' : 'N'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{result.name}</h4>
                        <p className="text-xs text-gray-500">{result.category}</p>
                      </div>
                    </div>
                  </div>
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
