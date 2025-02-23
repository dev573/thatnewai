import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Backdoor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual API endpoint
      if (email === "admin@thatnewai.com" && password === "admin123") {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Store JWT token in localStorage
        localStorage.setItem("adminToken", "dummy-token");
        
        toast({
          title: "Login successful",
          description: "Welcome to ThatNewAI Admin Panel",
        });
        
        navigate("/admin/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-100 p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-gray-600 mt-3 text-lg">Please sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative">
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full transition-all duration-200 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
            </div>
            <div className="space-y-2 relative">
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 w-full transition-all duration-200 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200 py-6 text-lg font-medium shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Backdoor;