import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Newspaper, BarChart, Lightbulb, Bot } from "lucide-react";
import { fetchNews, NewsItem } from "@/services/newsApi";
import { LoaderFull, SkeletonLoader } from "@/components/ui/loader";

const ITEMS_PER_PAGE = 6;

const AINews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate total pages based on actual data
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await fetchNews(currentPage, ITEMS_PER_PAGE);
        setNewsItems(response.items);
        
        // If we're on page 1, set the total items based on the number of items received
        // This assumes that if we get fewer items than ITEMS_PER_PAGE, there are no more pages
        if (currentPage === 1) {
          const estimatedTotal = response.items.length < ITEMS_PER_PAGE 
            ? response.items.length 
            : ITEMS_PER_PAGE * 2; // Assume at least 2 pages if we get a full page
          setTotalItems(estimatedTotal);
        } 
        // If we're on page > 1 and get items, update total count
        else if (response.items.length > 0) {
          // Use functional update to avoid dependency on totalItems
          setTotalItems(prevTotal => 
            Math.max(prevTotal, (currentPage - 1) * ITEMS_PER_PAGE + response.items.length)
          );
        }
        // If we're on page > 1 and get no items, adjust total count
        else if (response.items.length === 0) {
          setTotalItems((currentPage - 1) * ITEMS_PER_PAGE);
          // Go back to the last valid page
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        
        setError(null);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [currentPage]);

  const handleReadMore = (news: NewsItem) => {
    navigate(`/news/${news.slug}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">AI News</h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with the latest developments in artificial intelligence
          </p>
        </div>

        {loading ? (
          <>
            <LoaderFull text="Loading latest AI news..." variant="primary" />
            
            <div className="space-y-8 mt-8 opacity-60">
              {[...Array(3)].map((_, index) => (
                <article key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-48 w-full bg-gray-200 md:h-full"></div>
                    </div>
                    <div className="p-6 md:w-3/4 flex flex-col justify-between">
                      <div className="flex items-center text-sm text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-gray-300" />
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        <Clock className="w-4 h-4 ml-4 mr-2 text-gray-300" />
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <SkeletonLoader className="mb-4" />
                      <div className="flex items-center justify-between mt-6">
                        <div className="w-28 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-8 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {newsItems.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="md:flex items-stretch">
                  <div className="md:w-1/4 flex-shrink-0">
                    {news.image ? (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="h-48 w-full object-cover md:h-full"
                        onError={(e) => {
                          // If image fails to load, hide this element and let React show the fallback
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <div className="h-48 w-full md:h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100">
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          {renderIcon(news.id, news.title)}
                          <span className="text-sm text-gray-500 mt-2 line-clamp-2">{news.title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {news.date}
                      <Clock className="w-4 h-4 ml-4 mr-2" />
                      {news.read_time}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {news.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{news.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500 font-medium">
                        {news.author ? `By ${news.author}` : 'AI News Update'}
                      </span>
                      <Button
                        variant="outline"
                        className="text-purple-600 hover:text-purple-700 border-purple-600 hover:border-purple-700 whitespace-nowrap"
                        onClick={() => handleReadMore(news)}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination - only show if we have items and more than one page */}
        {!loading && !error && newsItems.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className={currentPage === page ? "bg-purple-600" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

// Helper function to render an appropriate AI icon for a news item
const renderIcon = (id: string, title: string) => {
  // Use deterministic icon selection based on the ID or title
  const hash = id ? id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : title.length;
  const iconIndex = hash % 4;
  
  const icons = [
    <Bot key="bot" className="h-16 w-16 text-purple-500" />,
    <Newspaper key="news" className="h-16 w-16 text-purple-500" />,
    <Lightbulb key="light" className="h-16 w-16 text-purple-500" />,
    <BarChart key="chart" className="h-16 w-16 text-purple-500" />
  ];
  
  return icons[iconIndex];
};

export default AINews;
