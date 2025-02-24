import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import SearchResultCard from "@/components/SearchResultCard";
import { SearchResult, searchTools } from "@/lib/api";

const SearchResults = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await searchTools(query, page, 10);
        setResults(response.items);
        setTotalPages(response.total_pages);
        setTotal(response.total);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-600">
            Found {total} results for "{query}"
          </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <SearchResultCard
              key={item.id}
              type={item.type}
              id={item.id}
              name={item.name}
              description={item.description}
              category={item.category}
              date={item.date}
              url={item.url.replace('/tools/', '/tool/')}
            />
          ))}
        </div>

        {!loading && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{query}"</p>
          </div>
        )}
      </main>
    </>
  );
};

export default SearchResults;
