
import { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ActivityFormProps {
  tripId: string;
  existingActivity?: Activity;
  onComplete: () => void;
}

export function ActivityForm({ tripId, existingActivity, onComplete }: ActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingActivity?.imageUrl || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create URL preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const date = formData.get("date") as string;
      const time = formData.get("time") as string;
      const location = formData.get("location") as string;
      const cost = parseFloat(formData.get("cost") as string) || 0;
      const notes = formData.get("notes") as string;
      
      let imageUrl = existingActivity?.imageUrl || "";
      
      // Upload image if provided
      if (image) {
        const storageRef = ref(storage, `activities/${tripId}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      
      const activityData = {
        title,
        description,
        date,
        time,
        location,
        cost,
        notes,
        imageUrl,
        tripId,
      };
      
      if (existingActivity) {
        // Update existing activity
        await updateDoc(doc(db, "activities", existingActivity.id!), activityData);
        toast({
          title: "Success",
          description: "Activity updated successfully!"
        });
      } else {
        // Create new activity
        await addDoc(collection(db, "activities"), activityData);
        toast({
          title: "Success",
          description: "Activity added successfully!"
        });
      }
      
      onComplete();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast({
        title: "Error",
        description: "Failed to save activity",
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
          <CardTitle>
            {existingActivity ? "Edit Activity" : "Add Activity"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Visit the Colosseum"
              defaultValue={existingActivity?.title}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={existingActivity?.date}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time (Optional)</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={existingActivity?.time}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              placeholder="Piazza del Colosseo, Rome, Italy"
              defaultValue={existingActivity?.location}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (Optional)</Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              defaultValue={existingActivity?.cost?.toString()}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description of the activity..."
              rows={3}
              defaultValue={existingActivity?.description}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional notes..."
              rows={2}
              defaultValue={existingActivity?.notes}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activityImage">Image (Optional)</Label>
            <Input
              id="activityImage"
              name="activityImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2 relative w-full h-40">
                <img
                  src={imagePreview}
                  alt="Image preview"
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
            onClick={onComplete}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? existingActivity
                ? "Updating..."
                : "Adding..."
              : existingActivity
              ? "Update Activity"
              : "Add Activity"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
