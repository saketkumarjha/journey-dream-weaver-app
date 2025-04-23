
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/navigation/Navbar";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 container max-w-screen-xl py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Journey</h1>
            <p className="text-muted-foreground text-lg">
              Create an account to start planning your travel adventures. 
              Save destinations, build itineraries, and organize your trips all in one place.
            </p>
            <div className="pt-4 hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&h=400" 
                alt="Travel"
                className="rounded-lg shadow-lg object-cover w-full max-w-md mx-auto"
              />
            </div>
          </div>
          <div>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
