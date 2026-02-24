import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Newspaper, Bot, Lightbulb, BarChart } from "lucide-react";
import { fetchNews, Article } from "@/services/newsApi";
import { LoaderFull, SkeletonLoader } from "@/components/ui/loader";

const ITEMS_PER_PAGE = 12;

const AINews = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchNews(currentPage, ITEMS_PER_PAGE, { category });
        setArticles(response.data);
        setTotal(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
        setError(null);
      } catch {
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, category]);

  const clearCategory = () => {
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} AI News | ThatNewAI` : "AI News | ThatNewAI"}</title>
        <meta name="description" content={category ? `Latest ${category} news in artificial intelligence — curated by ThatNewAI.` : "Browse the latest AI news — models, tools, research papers, startups, and open source projects."} />
        <link rel="canonical" href={`https://thatnewai.com/ai-news${category ? `?category=${category}` : ""}`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI News</h1>
          <p className="mt-2 text-lg text-gray-600">
            Stay updated with the latest developments in artificial intelligence
          </p>
          {category && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                {category}
              </span>
              <button
                onClick={clearCategory}
                className="text-sm text-gray-500 hover:text-gray-800 underline"
              >
                Clear filter
              </button>
            </div>
          )}
          {!loading && (
            <p className="mt-2 text-sm text-gray-500">{total} articles found</p>
          )}
        </div>

        {loading ? (
          <>
            <LoaderFull text="Loading latest AI news..." variant="primary" />
            <div className="space-y-6 mt-8 opacity-60">
              {[...Array(3)].map((_, i) => (
                <article key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/4">
                      <div className="h-48 w-full bg-gray-200 md:h-full" />
                    </div>
                    <div className="p-6 md:w-3/4">
                      <SkeletonLoader className="mb-4" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/news/${article.slug || article._id}`)}
              >
                <div className="md:flex items-stretch">
                  <div className="md:w-1/4 flex-shrink-0">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-48 w-full object-cover md:h-full"
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) parent.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-48 w-full md:h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100">
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          {renderIcon(article._id)}
                          <span className="text-xs text-gray-500 mt-2 capitalize">{article.category}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 capitalize">
                          {article.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h2>
                      {article.summary && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500 font-medium">
                        {article.source}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Source <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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

const renderIcon = (id: string) => {
  const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const icons = [
    <Bot key="bot" className="h-16 w-16 text-purple-500" />,
    <Newspaper key="news" className="h-16 w-16 text-purple-500" />,
    <Lightbulb key="light" className="h-16 w-16 text-purple-500" />,
    <BarChart key="chart" className="h-16 w-16 text-purple-500" />,
  ];
  return icons[hash % icons.length];
};

export default AINews;
