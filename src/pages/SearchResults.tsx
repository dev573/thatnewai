import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ExternalLink } from "lucide-react";
import { Article, searchNews } from "@/services/newsApi";
import { LoaderFull, SkeletonLoader } from "@/components/ui/loader";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setArticles([]);
      setTotal(0);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchNews(query, page, 20);
        setArticles(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } catch {
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setPage(1);
      setSearchParams({ q: localQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{query ? `"${query}" — Search AI News | ThatNewAI` : "Search AI News — Find Models, Tools, Papers & More | ThatNewAI"}</title>
        <meta name="description" content={query ? `Search results for "${query}" on ThatNewAI. Find relevant AI news, research papers, tools, and announcements.` : "Search across thousands of AI news articles — models, tools, research papers, startups, and open source projects from 23+ sources."} />
        <link rel="canonical" href={`https://thatnewai.com/search${query ? `?q=${encodeURIComponent(query)}` : ""}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={query ? `"${query}" — Search AI News | ThatNewAI` : "Search AI News | ThatNewAI"} />
        <meta property="og:description" content={query ? `Search results for "${query}" on ThatNewAI.` : "Search the latest AI news across models, tools, papers, and more."} />
        <meta property="og:url" content={`https://thatnewai.com/search${query ? `?q=${encodeURIComponent(query)}` : ""}`} />
        <meta property="og:site_name" content="ThatNewAI" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={query ? `"${query}" — Search | ThatNewAI` : "Search AI News | ThatNewAI"} />
        <meta name="twitter:description" content={query ? `Search results for "${query}" on ThatNewAI.` : "Search the latest AI news."} />
      </Helmet>
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <Input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search AI news..."
              className="h-12 pl-10 pr-24 w-full rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <Search className="absolute left-3 text-gray-400" size={20} />
            <Button
              type="submit"
              className="absolute right-1.5 h-9 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
            >
              Search
            </Button>
          </div>
        </form>

        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
            <p className="text-gray-600">
              {loading ? `Searching for "${query}"...` : `Found ${total} results for "${query}"`}
            </p>
          </div>
        )}

        {loading ? (
          <>
            <LoaderFull text="Searching..." />
            <div className="space-y-4 mt-6 opacity-50">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <SkeletonLoader className="w-full h-16" />
                </div>
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : articles.length === 0 && query ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article._id}
                onClick={() => navigate(`/news/${article.slug || article._id}`)}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer"
              >
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 capitalize">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{article.summary}</p>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">{article.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
