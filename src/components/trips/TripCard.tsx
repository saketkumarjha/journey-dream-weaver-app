
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trip } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";

interface TripCardProps {
  trip: Trip;
  className?: string;
}

export function TripCard({ trip, className }: TripCardProps) {
  const tripTypeColors = {
    adventure: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    leisure: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    work: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    family: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    romantic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
    solo: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    other: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link to={`/trips/${trip.id}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-md group h-full flex flex-col",
          className
        )}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={trip.coverImage || `https://source.unsplash.com/random/800x600/?${trip.destination.replace(" ", "-")}`}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <Badge
            className={cn(
              "absolute top-3 right-3 font-normal",
              tripTypeColors[trip.tripType]
            )}
          >
            {trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)}
          </Badge>
        </div>
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">{trip.title}</h3>
          <div className="flex items-center gap-1 mb-2 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{trip.destination}</span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {trip.description}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(trip.updatedAt), { addSuffix: true })}
        </CardFooter>
      </Card>
    </Link>
  );
}
