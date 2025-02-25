import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNewsById, NewsItem } from "@/services/newsApi";
import MDEditor from '@uiw/react-md-editor';

const NewsDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewsItem = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const newsItem = await fetchNewsById(slug);
        setNews(newsItem);
        if (!newsItem) {
          setError("News article not found");
        } else {
          setError(null);
        }
      } catch (err) {
        setError("Failed to load news article. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNewsItem();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{error || "Article Not Found"}</h1>
            <Button
              className="mt-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Button
          variant="ghost"
          className="mb-8 text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        <article>
          {news.image && (
            <div className="aspect-w-16 aspect-h-9 mb-8">
              <img
                src={news.image}
                alt={news.title}
                className="rounded-lg object-cover w-full h-64 md:h-96"
                onError={(e) => {
                  // Hide the parent div if image fails to load
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.style.display = 'none';
                  }
                }}
              />
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            {news.date}
            <Clock className="w-4 h-4 ml-4 mr-2" />
            {news.read_time}
            <span className="ml-4">By {news.author}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            {news.description}
          </p>

          <div className="prose prose-lg max-w-none">
            <MDEditor.Markdown 
              source={news.content} 
              style={{ backgroundColor: 'transparent', color: 'inherit' }}
            />
          </div>

          <div className="mt-8 pt-8 border-t">
            <span className="text-sm text-gray-500">Category: {news.category}</span>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
