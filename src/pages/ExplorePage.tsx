
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/navigation/Navbar";
import { TripCard } from "@/components/trips/TripCard";
import { Input } from "@/components/ui/input";
import { Trip, TripType } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExplorePage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<TripType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  const tripTypes: { value: TripType | "all"; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "adventure", label: "Adventure" },
    { value: "leisure", label: "Leisure" },
    { value: "work", label: "Work" },
    { value: "family", label: "Family" },
    { value: "romantic", label: "Romantic" },
    { value: "solo", label: "Solo" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        // This would typically have a more complex query with pagination
        // For demo purposes, we're fetching all public trips
        const tripQuery = query(
          collection(db, "trips"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(tripQuery);
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trip[];

        setTrips(tripsData);
        setFilteredTrips(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error",
          description: "Failed to load trips",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    // Filter trips based on search query and selected type
    const filtered = trips.filter((trip) => {
      const matchesSearch =
        searchQuery === "" ||
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || trip.tripType === selectedType;

      return matchesSearch && matchesType;
    });

    setFilteredTrips(filtered);
  }, [searchQuery, selectedType, trips]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container max-w-screen-xl py-8 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Trips</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Discover travel itineraries from around the world. Get inspired for your next adventure.
          </p>
        </div>

        <div className="mb-8 mx-auto max-w-2xl">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by destination, title, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {tripTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="mb-2"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No trips match your search.</p>
            <p className="text-muted-foreground">Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
