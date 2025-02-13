import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import newsData from "@/data/news.json";

const NewsDetail = () => {
  const { id } = useParams();
  const news = newsData.news.find(item => item.id === id);

  if (!news) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Article Not Found</h1>
            <Button
              className="mt-4"
              onClick={() => window.history.back()}
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
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        <article>
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <img
              src={news.image}
              alt={news.title}
              className="rounded-lg object-cover w-full h-64 md:h-96"
            />
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            {news.date}
            <Clock className="w-4 h-4 ml-4 mr-2" />
            {news.readTime}
            <span className="ml-4">By {news.author}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            {news.description}
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {news.content}
            </p>
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
