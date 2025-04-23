
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navigation/Navbar";
import { TripForm } from "@/components/trips/TripForm";
import { Trip } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft } from "lucide-react";

const TripEdit = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;

      try {
        const tripDoc = await getDoc(doc(db, "trips", tripId));
        if (!tripDoc.exists()) {
          toast.error("Trip not found");
          navigate("/dashboard");
          return;
        }

        const tripData = { id: tripDoc.id, ...tripDoc.data() } as Trip;
        
        // Check if user is authorized to edit this trip
        if (tripData.userId !== user?.uid) {
          toast.error("You don't have permission to edit this trip");
          navigate("/dashboard");
          return;
        }

        setTrip(tripData);
      } catch (error) {
        console.error("Error fetching trip:", error);
        toast.error("Failed to load trip");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTrip();
    }
  }, [tripId, user, navigate]);

  if (loading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container max-w-screen-xl py-8 px-4 text-center">
          <p>Trip not found.</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container max-w-screen-lg py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/trips/${tripId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trip
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Edit Trip</h1>
          <p className="text-muted-foreground">
            Update your trip details
          </p>
        </div>
        
        <TripForm editTrip={trip} />
      </div>
    </div>
  );
};

export default TripEdit;
