// LocationInput.tsx
import React from 'react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onChange }) => {
  // List of popular destinations for the datalist suggestions
  const popularDestinations = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania',
    'Japan', 'Italy', 'France', 'Australia', 'Brazil', 'Canada', 'Thailand',
    'Mexico', 'New Zealand', 'Peru', 'South Africa', 'Spain', 'United States'
  ];

  return (
    <div className="space-y-2">
      <label htmlFor="location-input" className="block text-sm font-medium text-gray-700">
        Where do you want to go? <span className="text-gray-500 text-xs">(Continent or country)</span>
      </label>
      
      <div className="relative">
        <input
          id="location-input"
          type="text"
          list="popular-destinations"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a continent or country"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        
        <datalist id="popular-destinations">
          {popularDestinations.map((destination) => (
            <option key={destination} value={destination} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default LocationInput;