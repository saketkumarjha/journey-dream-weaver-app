
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navigation/Navbar";
import { TripForm } from "@/components/trips/TripForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TripNew = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container max-w-screen-lg py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Create New Trip</h1>
          <p className="text-muted-foreground">
            Fill in the details to start planning your journey
          </p>
        </div>
        
        <TripForm />
      </div>
    </div>
  );
};

export default TripNew;
