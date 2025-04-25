// InterestsSelector.tsx
import React from 'react';
import { Interest } from './TravelRecommender';

interface InterestsSelectorProps {
  availableInterests: Interest[];
  selectedInterests: string[];
  onChange: (selectedInterests: string[]) => void;
}

const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  availableInterests,
  selectedInterests,
  onChange
}) => {
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onChange(selectedInterests.filter(id => id !== interestId));
    } else {
      onChange([...selectedInterests, interestId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        What are you interested in? <span className="text-gray-500 text-xs">(Select at least one)</span>
      </label>
      
      <div className="flex flex-wrap gap-2">
        {availableInterests.map((interest) => (
          <button
            key={interest.id}
            type="button"
            onClick={() => toggleInterest(interest.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedInterests.includes(interest.id)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {interest.label}
          </button>
        ))}
      </div>
      
      {selectedInterests.length > 0 && (
        <p className="text-sm text-gray-600">
          Selected: {selectedInterests.length} {selectedInterests.length === 1 ? 'interest' : 'interests'}
        </p>
      )}
    </div>
  );
};

export default InterestsSelector;