// RecommendationResults.tsx
import React from 'react';
import { Recommendation } from './TravelRecommender';

interface RecommendationResultsProps {
  recommendations: Recommendation[];
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({ recommendations }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-center text-indigo-700">
        Your Personalized Travel Recommendations
      </h3>
      
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {recommendations.map((recommendation, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Placeholder image - in production, you'd replace with actual destination images */}
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 16a.5.5 0 01-.5-.5v-6a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-2zM9.5 16a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-2zM13.5 16a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-2z"/>
              </svg>
            </div>
            
            <div className="p-5">
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {recommendation.name}
                {recommendation.region && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    ({recommendation.region})
                  </span>
                )}
              </h4>
              
              <div className="mt-4 space-y-3">
                <div>
                  <h5 className="text-sm font-semibold text-indigo-700">Why It Fits Your Interests</h5>
                  <p className="text-sm text-gray-600">{recommendation.whyItFits}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-indigo-700">What Makes It Unique</h5>
                  <p className="text-sm text-gray-600">{recommendation.uniqueAppeal}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-indigo-700">Top Activities</h5>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {recommendation.activities.map((activity, activityIndex) => (
                      <li key={activityIndex}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationResults;