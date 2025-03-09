import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Dashboard from "./pages/admin/Dashboard";
import PostForm from "./pages/admin/PostForm";
import EditToolForm from "./pages/admin/EditToolForm";
import NewToolForm from "./pages/admin/NewToolForm";
import Login from "./pages/Login";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/tool/:slug" element={<ToolDetail />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/ai-news" element={<AINews />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/backdoor" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/posts/new" element={<ProtectedRoute requireAdmin={true}><PostForm /></ProtectedRoute>} />
          <Route path="/admin/posts/edit/:slug" element={<ProtectedRoute requireAdmin={true}><PostForm /></ProtectedRoute>} />
          <Route path="/admin/tools/new" element={<ProtectedRoute requireAdmin={true}><NewToolForm /></ProtectedRoute>} />
          <Route path="/admin/tools/edit/:slug" element={<ProtectedRoute requireAdmin={true}><EditToolForm /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
