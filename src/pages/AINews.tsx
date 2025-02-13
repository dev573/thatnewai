import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import newsData from "@/data/news.json";

const ITEMS_PER_PAGE = 6;

const AINews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(newsData.news.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = newsData.news.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">AI News</h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with the latest developments in artificial intelligence
          </p>
        </div>

        <div className="space-y-8">
          {currentNews.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-48 w-full object-cover md:h-full"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {news.date}
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    {news.readTime}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {news.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{news.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {news.author}</span>
                    <Button
                      variant="outline"
                      className="text-purple-600 hover:text-purple-700 border-purple-600 hover:border-purple-700"
                      onClick={() => navigate(`/news/${news.id}`)}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
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
      </main>
      <Footer />
    </div>
  );
};

export default AINews;
