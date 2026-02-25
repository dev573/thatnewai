import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { NewsletterDialog } from "./NewsletterDialog";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ThatNewAI
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/ai-news" className="text-gray-700 hover:text-purple-600 transition-colors">
              AI News
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-purple-600 transition-colors">
              Search
            </Link>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setShowNewsletter(true)}
            >
              Newsletter
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            <Link
              to="/ai-news"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              AI News
            </Link>
            <Link
              to="/search"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              Search
            </Link>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
              onClick={() => setShowNewsletter(true)}
            >
              Newsletter
            </Button>
          </div>
        </div>
      )}
      <NewsletterDialog
        open={showNewsletter}
        onOpenChange={setShowNewsletter}
      />
    </nav>
  );
};
