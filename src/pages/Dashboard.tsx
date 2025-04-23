import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navigation/Navbar";
import { TripCard } from "@/components/trips/TripCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trip } from "@/lib/types";
import { toast } from "@/components/ui/sonner";
import { MapPin, Plus, Search } from "lucide-react";

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const tripQuery = query(
          collection(db, "trips"),
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );

        const querySnapshot = await getDocs(tripQuery);
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trip[];

        setTrips(tripsData);
        console.log(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Failed to load trips");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTrips();
    }
  }, [user]);

  const filteredTrips = trips.filter((trip) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const tripTitle = trip.title.toLowerCase();
    const tripDestination = trip.destination.toLowerCase();
    const tripDescription = trip.description.toLowerCase();

    return searchTerms.every(
      (term) =>
        tripTitle.includes(term) ||
        tripDestination.includes(term) ||
        tripDescription.includes(term)
    );
  });

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
      <div className="container max-w-screen-xl py-8 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
            <p className="text-muted-foreground">
              Manage and plan your journeys
            </p>
          </div>
          <Button
            onClick={() => navigate("/trips/new")}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> New Trip
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips by title, destination, or description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-200 dark:bg-gray-800 rounded-lg"
              ></div>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No trips match your search.</p>
            <p className="text-muted-foreground">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-medium">No trips yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start by creating your first trip itinerary to keep track of your
              travel plans and experiences.
            </p>
            <Button
              onClick={() => navigate("/trips/new")}
              variant="default"
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Trip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
