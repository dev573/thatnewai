
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedTools } from "@/components/FeaturedTools";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { NewsletterDialog } from "@/components/NewsletterDialog";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <FeaturedTools />
        <CategoriesGrid />
        <Footer />
      </main>
      <NewsletterDialog 
        open={showNewsletter} 
        onOpenChange={setShowNewsletter} 
      />
    </div>
  );
};

export default Index;
