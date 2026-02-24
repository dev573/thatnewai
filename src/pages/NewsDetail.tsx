import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, ArrowLeft, ExternalLink, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNewsById, Article } from "@/services/newsApi";
import MDEditor from "@uiw/react-md-editor";

const SITE_URL = "https://thatnewai.com";

const NewsDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await fetchNewsById(slug);
        setArticle(data);
        setError(null);
      } catch {
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-400">Loading...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{error || "Article Not Found"}</h1>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isArxiv = article.category === "papers" && article.metadata?.abstract;

  const canonicalUrl = `${SITE_URL}/news/${article.slug || article._id}`;
  const metaDescription = article.meta_description || article.summary || `${article.title} — AI news from ${article.source}`;
  const publishedDate = new Date(article.published_at).toISOString();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`${article.title} | ThatNewAI`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="ThatNewAI" />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:section" content={article.category} />
        {article.tags?.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content={article.image_url ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={metaDescription} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
      </Helmet>

      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Button
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <article>
          {article.image_url && (
            <div className="mb-8">
              <img
                src={article.image_url}
                alt={article.title}
                className="rounded-lg object-cover w-full h-64 md:h-96"
                onError={(e) => {
                  if (e.currentTarget.parentElement)
                    e.currentTarget.parentElement.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
              {article.category}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(article.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>via {article.source}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Summary box */}
          {article.summary && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-5 mb-8">
              <p className="text-sm font-semibold text-purple-700 mb-1 uppercase tracking-wide">TL;DR</p>
              <p className="text-gray-800 text-lg leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Full editorial content */}
          {article.content && (
            <div className="prose prose-lg max-w-none mb-8 prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900" data-color-mode="light">
              <MDEditor.Markdown
                source={article.content}
                style={{ backgroundColor: "transparent", color: "inherit" }}
              />
            </div>
          )}

          {/* ArXiv-specific details */}
          {isArxiv && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Paper Details</h3>
              {article.metadata?.authors && (
                <div className="flex items-start gap-2">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Authors</p>
                    <p className="text-sm text-gray-600">{article.metadata.authors}</p>
                  </div>
                </div>
              )}
              {article.metadata?.abstract && (
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Abstract</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {article.metadata.abstract}
                    </p>
                  </div>
                </div>
              )}
              {article.metadata?.pdf_url && (
                <a
                  href={article.metadata.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  <FileText className="w-4 h-4 mr-1" /> View PDF
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read original link */}
          <div className="mt-8 pt-6 border-t flex items-center gap-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Read Original Article <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            {article.original_title && article.original_title !== article.title && (
              <p className="text-sm text-gray-400 italic">
                Original: "{article.original_title}"
              </p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
