
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AINews from "./pages/AINews";
import NewsDetail from "./pages/NewsDetail";
import SearchResults from "./pages/SearchResults";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import ToolDetail from "./pages/ToolDetail";
import Latest from "./pages/Latest";
import Submit from "./pages/Submit";
import NotFound from "./pages/NotFound";
import Backdoor from "./pages/Backdoor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/ai-news" element={<AINews />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/backdoor" element={<Backdoor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
