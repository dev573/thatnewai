import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedTools } from "@/components/FeaturedTools";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>ThatNewAI - Your Guide to the Latest AI Technologies</title>
        <meta name="description" content="Stay ahead with curated AI news from 23+ sources — research papers, model releases, open source tools, and more. Updated every 15 minutes." />
        <link rel="canonical" href="https://thatnewai.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ThatNewAI - Your Guide to the Latest AI Technologies" />
        <meta property="og:description" content="Stay ahead with curated AI news from 23+ sources — research papers, model releases, open source tools, and more." />
        <meta property="og:url" content="https://thatnewai.com" />
        <meta property="og:site_name" content="ThatNewAI" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="ThatNewAI - Your Guide to the Latest AI Technologies" />
        <meta name="twitter:description" content="Stay ahead with curated AI news from 23+ sources — research papers, model releases, open source tools, and more." />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <FeaturedTools />
        <CategoriesGrid />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
