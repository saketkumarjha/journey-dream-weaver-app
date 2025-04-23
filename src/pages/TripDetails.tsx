
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, orderBy, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navigation/Navbar";
import { ActivityForm } from "@/components/trips/ActivityForm";
import { Trip, Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Plus, Star, Trash } from "lucide-react";

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    const fetchTripAndActivities = async () => {
      if (!tripId) return;

      try {
        // Fetch trip
        const tripDoc = await getDoc(doc(db, "trips", tripId));
        if (!tripDoc.exists()) {
          toast.error("Trip not found");
          navigate("/dashboard");
          return;
        }

        const tripData = { id: tripDoc.id, ...tripDoc.data() } as Trip;
        
        // Check if user is authorized to view this trip
        if (tripData.userId !== user?.uid) {
          toast.error("You don't have permission to view this trip");
          navigate("/dashboard");
          return;
        }

        setTrip(tripData);

        // Fetch activities
        const activitiesQuery = query(
          collection(db, "activities"),
          where("tripId", "==", tripId),
          orderBy("date", "asc")
        );

        const querySnapshot = await getDocs(activitiesQuery);
        const activitiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Activity[];

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("Failed to load trip details");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTripAndActivities();
    }
  }, [tripId, user, navigate]);

  const toggleFavorite = async () => {
    if (!trip || !trip.id) return;

    try {
      const updatedTrip = { ...trip, isFavorite: !trip.isFavorite };
      await updateDoc(doc(db, "trips", trip.id), {
        isFavorite: !trip.isFavorite,
      });
      setTrip(updatedTrip);
      toast.success(
        trip.isFavorite
          ? "Removed from favorites"
          : "Added to favorites"
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip || !trip.id) return;

    try {
      // Delete trip
      await deleteDoc(doc(db, "trips", trip.id));
      
      // Delete all activities
      for (const activity of activities) {
        if (activity.id) {
          await deleteDoc(doc(db, "activities", activity.id));
        }
      }
      
      toast.success("Trip deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteDoc(doc(db, "activities", activityId));
      setActivities(activities.filter((a) => a.id !== activityId));
      toast.success("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowActivityForm(true);
  };

  const handleActivityFormComplete = () => {
    setSelectedActivity(null);
    setShowActivityForm(false);
    
    // Refresh activities
    if (tripId && user) {
      const fetchActivities = async () => {
        try {
          const activitiesQuery = query(
            collection(db, "activities"),
            where("tripId", "==", tripId),
            orderBy("date", "asc")
          );
  
          const querySnapshot = await getDocs(activitiesQuery);
          const activitiesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Activity[];
  
          setActivities(activitiesData);
        } catch (error) {
          console.error("Error refreshing activities:", error);
        }
      };
      
      fetchActivities();
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupActivitiesByDate = () => {
    const grouped: { [date: string]: Activity[] } = {};
    
    activities.forEach((activity) => {
      const date = activity.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    
    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  };

  const tripTypeColors = {
    adventure: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    leisure: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    work: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    family: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    romantic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
    solo: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    other: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container max-w-screen-xl py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="relative rounded-xl overflow-hidden h-60 md:h-80 mb-6">
          <img
            src={trip.coverImage || `https://source.unsplash.com/random/1200x800/?${trip.destination.replace(" ", "-")}`}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge
                  className={`mb-2 font-normal ${
                    tripTypeColors[trip.tripType]
                  }`}
                >
                  {trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)}
                </Badge>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
                  {trip.title}
                </h1>
                <div className="flex items-center text-white/80 text-sm md:text-base">
                  <MapPin className="h-4 w-4 mr-1" />
                  {trip.destination}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={toggleFavorite}
                >
                  <Star
                    className={`h-5 w-5 ${
                      trip.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Trip Details</h2>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/trips/${trip.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Trip
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this trip?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            trip and all its activities.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteTrip}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Start Date
                        </h3>
                        <p className="font-medium">{formatDate(trip.startDate)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          End Date
                        </h3>
                        <p className="font-medium">{formatDate(trip.endDate)}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </h3>
                      <p className="whitespace-pre-line">{trip.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Itinerary</h2>
                  <Dialog
                    open={showActivityForm}
                    onOpenChange={(open) => {
                      if (!open) {
                        setShowActivityForm(false);
                        setSelectedActivity(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setShowActivityForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <ActivityForm
                        tripId={trip.id!}
                        existingActivity={selectedActivity || undefined}
                        onComplete={handleActivityFormComplete}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {activities.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      No activities planned yet. Start building your itinerary!
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setShowActivityForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Activity
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {groupActivitiesByDate().map(([date, dateActivities]) => (
                      <div key={date}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">
                            {formatDate(date)}
                          </h3>
                        </div>

                        <div className="space-y-4 pl-5 border-l border-gray-200 dark:border-gray-700">
                          {dateActivities.map((activity) => (
                            <Card key={activity.id} className="overflow-hidden">
                              <CardContent className="p-0">
                                {activity.imageUrl && (
                                  <div className="h-48 overflow-hidden">
                                    <img
                                      src={activity.imageUrl}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-5">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-lg">
                                      {activity.title}
                                    </h4>
                                    <div className="flex gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => handleEditActivity(activity)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-destructive"
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Delete Activity
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete this activity?
                                              This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => activity.id && handleDeleteActivity(activity.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>

                                  {activity.time && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{activity.time}</span>
                                    </div>
                                  )}

                                  {activity.location && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                      <MapPin className="h-3.5 w-3.5" />
                                      <span>{activity.location}</span>
                                    </div>
                                  )}

                                  {activity.description && (
                                    <p className="mb-3 text-sm">{activity.description}</p>
                                  )}

                                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
                                    {activity.cost !== undefined && activity.cost > 0 && (
                                      <div>
                                        <span className="font-medium">Cost: </span>
                                        ${activity.cost.toFixed(2)}
                                      </div>
                                    )}
                                    {activity.notes && (
                                      <div>
                                        <span className="font-medium">Notes: </span>
                                        {activity.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Trip Summary</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Duration
                    </h3>
                    <p className="font-medium">
                      {Math.ceil(
                        (new Date(trip.endDate).getTime() -
                          new Date(trip.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                      days
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Activities
                    </h3>
                    <p className="font-medium">{activities.length}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Trip Type
                    </h3>
                    <Badge
                      className={`font-normal ${
                        tripTypeColors[trip.tripType]
                      }`}
                    >
                      {trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
