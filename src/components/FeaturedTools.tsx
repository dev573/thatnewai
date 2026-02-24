import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Article, fetchTrending } from "@/services/newsApi";
import { LoaderFull } from "./ui/loader";
import { TrendingUp, ExternalLink } from "lucide-react";

export const FeaturedTools = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTrending(6, 7);
        setArticles(data);
        setError(null);
      } catch {
        setError("Failed to load trending stories.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trending Stories</h2>
            <p className="mt-4 text-lg text-gray-600">Top AI news from the past week</p>
          </div>
          <LoaderFull text="Loading trending stories..." />
        </div>
      </section>
    );
  }

  if (error || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Trending Stories</h2>
          <p className="mt-4 text-lg text-gray-600">Top AI news from the past week</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article._id}
              onClick={() => navigate(`/news/${article.slug || article._id}`)}
              className="group relative bg-white/50 backdrop-blur-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer"
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    {article.category}
                  </span>
                  {article.engagement_score > 0 && (
                    <span className="inline-flex items-center text-xs text-orange-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {article.engagement_score}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
