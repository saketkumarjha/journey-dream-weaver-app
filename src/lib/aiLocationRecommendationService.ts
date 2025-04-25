// services/recommendationService.ts
import { Recommendation } from "../components/AiBotComponents/TravelRecommender";

/**
 * Interface for the request payload to the recommendations API
 */
interface RecommendationRequest {
  interests: string[];
  location: string;
}

/**
 * Interface for the response from the Gemini API after processing
 */
interface RecommendationResponse {
  recommendations: Recommendation[];
}

/**
 * Service for getting travel recommendations from the backend API
 */
export const recommendationService = {
  /**
   * Get travel recommendations based on interests and location
   * 
   * @param interests - Array of user interests
   * @param location - Desired travel destination (continent or country)
   * @returns Promise with an array of recommendations
   */
  async getRecommendations(
    interests: string[],
    location: string
  ): Promise<Recommendation[]> {
    try {
      // Format the request payload
      const request: RecommendationRequest = {
        interests,
        location
      };

      // Send request to your backend API
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API error with status code: ${response.status}`
        );
      }

      // Parse and return the recommendations
      const data: RecommendationResponse = await response.json();
      return data.recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }
};

export default recommendationService;