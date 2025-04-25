// TravelRecommender.tsx
import React, { useState } from 'react';
import InterestsSelector from './InterestsSelector';
import LocationInput from './LocationInput';
import RecommendationResults from './RecommendationResults';
import recommendationService from "../../lib/aiLocationRecommendationService.ts"
// Define types
export type Interest = {
  id: string;
  label: string;
};

export type Location = string;

export type Recommendation = {
  name: string;
  region?: string;
  whyItFits: string;
  uniqueAppeal: string;
  activities: string[];
};

const TravelRecommender: React.FC = () => {
  // Available interests for selection
  const availableInterests: Interest[] = [
    { id: 'nature', label: 'Nature' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'food', label: 'Food' },
    { id: 'history', label: 'History' },
    { id: 'art', label: 'Art' },
    { id: 'culture', label: 'Culture' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'beaches', label: 'Beaches' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'hiking', label: 'Hiking' },
    { id: 'cities', label: 'Cities' },
    { id: 'mountains', label: 'Mountains' },
    { id: 'photography', label: 'Photography' },
    { id: 'offbeat', label: 'Off-the-beaten-path' },
  ];

  // State management
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Import recommendation service at the top of the file
 

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    
    if (!location.trim()) {
      setError('Please enter a destination');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Format interests for display in UI if needed
      const formattedInterests = selectedInterests.map(id => 
        availableInterests.find(interest => interest.id === id)?.label
      ).join(', ');
      
      // Get recommendations from the API service
      const results = await recommendationService.getRecommendations(
        selectedInterests,
        location
      );
      
      setRecommendations(results);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedInterests([]);
    setLocation('');
    setRecommendations(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Travel Destination Finder</h2>
      
      {!recommendations ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InterestsSelector
            availableInterests={availableInterests}
            selectedInterests={selectedInterests}
            onChange={setSelectedInterests}
          />
          
          <LocationInput 
            value={location}
            onChange={setLocation}
          />
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Finding Places...</span>
                </div>
              ) : (
                'Find Perfect Places'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <RecommendationResults recommendations={recommendations} />
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300"
            >
              Start New Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelRecommender;