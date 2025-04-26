import React from "react";
import TravelRecommender from "../components/AiBotComponents/TravelRecommender";

function YourPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Plan Your Perfect Trip</h1>
      <TravelRecommender />
    </div>
  );
}

export default YourPage;
