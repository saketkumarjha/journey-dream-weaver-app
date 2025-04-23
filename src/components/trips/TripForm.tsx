
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "@/lib/firebase";
import { Trip, TripType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface TripFormProps {
  editTrip?: Trip;
}

export function TripForm({ editTrip }: TripFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    editTrip?.coverImage || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Create URL preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a trip",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const destination = formData.get("destination") as string;
      const startDate = formData.get("startDate") as string;
      const endDate = formData.get("endDate") as string;
      const tripType = formData.get("tripType") as TripType;
      
      let coverImageUrl = editTrip?.coverImage || "";
      
      // Upload image if provided
      if (coverImage) {
        const storageRef = ref(storage, `trips/${auth.currentUser.uid}/${Date.now()}-${coverImage.name}`);
        const snapshot = await uploadBytes(storageRef, coverImage);
        coverImageUrl = await getDownloadURL(snapshot.ref);
      }
      
      const tripData = {
        title,
        description,
        destination,
        startDate,
        endDate,
        tripType,
        coverImage: coverImageUrl,
        userId: auth.currentUser.uid,
        createdAt: editTrip ? editTrip.createdAt : Date.now(),
        updatedAt: Date.now(),
      };
      
      if (editTrip) {
        // Update existing trip
        await updateDoc(doc(db, "trips", editTrip.id!), tripData);
        toast({
          title: "Success",
          description: "Trip updated successfully!"
        });
        navigate(`/trips/${editTrip.id}`);
      } else {
        // Create new trip
        const docRef = await addDoc(collection(db, "trips"), tripData);
        toast({
          title: "Success",
          description: "Trip created successfully!"
        });
        navigate(`/trips/${docRef.id}`);
      }
    } catch (error) {
      console.error("Error creating/updating trip:", error);
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{editTrip ? "Edit Trip" : "Create New Trip"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Trip Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Summer vacation in Italy"
              defaultValue={editTrip?.title}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              placeholder="Rome, Italy"
              defaultValue={editTrip?.destination}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={editTrip?.startDate}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={editTrip?.endDate}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tripType">Trip Type</Label>
            <Select name="tripType" defaultValue={editTrip?.tripType || "leisure"}>
              <SelectTrigger>
                <SelectValue placeholder="Select trip type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="leisure">Leisure</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your trip..."
              rows={4}
              defaultValue={editTrip?.description}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {coverImagePreview && (
              <div className="mt-2 relative w-full h-40">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? editTrip
                ? "Updating..."
                : "Creating..."
              : editTrip
              ? "Update Trip"
              : "Create Trip"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
