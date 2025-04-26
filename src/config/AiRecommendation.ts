// // server/api/recommendations.ts
// // This is a mock implementation for development
// // You would replace this with actual Gemini API integration

// import { GoogleGenAI } from '@google/genai';
// import { Request, Response } from 'express';

// // Define types
// type Interest = string;
// type Location = string;

// interface RecommendationRequest {
//   interests: Interest[];
//   location: Location;
// }

// interface Recommendation {
//   name: string;
//   region?: string;
//   whyItFits: string;
//   uniqueAppeal: string;
//   activities: string[];
// }

// interface RecommendationResponse {
//   recommendations: Recommendation[];
// }

// export default async function handler(req: Request, res: Response) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { interests, location } = req.body as RecommendationRequest;

//     // Validate the request
//     if (!interests || !Array.isArray(interests) || interests.length === 0) {
//       return res.status(400).json({ message: 'Invalid interests provided' });
//     }

//     if (!location || typeof location !== 'string' || location.trim() === '') {
//       return res.status(400).json({ message: 'Invalid location provided' });
//     }

//     // In a real implementation, you would call the Gemini API here using the
//     // code from your paste.txt file, with some modifications
    
//     // Example of how you would integrate with Gemini API:
//     /*
//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });
    
//     const model = 'gemini-2.5-pro-preview-03-25';
//     const config = {
//       thinkingConfig: {
//         thinkingBudget: 0,
//       },
//       responseMimeType: 'text/plain',
//     };

//     // Format the user input for Gemini
//     const formattedInterests = interests.join(', ');
//     const userInput = `Interests: ${formattedInterests}\nLocation: ${location}`;

//     const contents = [
//       // Include the existing content from your paste.txt file
//       // Then add the user input
//       {
//         role: 'user',
//         parts: [{ text: userInput }],
//       },
//     ];

//     // Call Gemini API
//     const response = await ai.models.generateContent({
//       model,
//       config,
//       contents,
//     });

//     // Process the response to extract recommendations
//     // This would require parsing the text response into structured data
//     */

//     // For now, return mock recommendations
//     const mockRecommendations: Recommendation[] = [
//       {
//         name: `Top Destination in ${location}`,
//         region: 'Popular Region',
//         whyItFits: `This location perfectly combines ${interests.slice(0, 3).join(', ')} with stunning scenery.`,
//         uniqueAppeal: 'Known for its unspoiled natural beauty and authentic cultural experiences.',
//         activities: [
//           'Explore hidden trails with local guides',
//           'Experience traditional cuisine with a modern twist',
//           'Participate in seasonal festivals and traditions'
//         ]
//       },
//       {
//         name: `Hidden Gem in ${location}`,
//         region: 'Off-the-beaten-path',
//         whyItFits: `An undiscovered paradise for ${interests.slice(0, 2).join(' and ')} enthusiasts.`,
//         uniqueAppeal: 'Few tourists visit this area, allowing for more authentic experiences.',
//         activities: [
//           'Discover secluded viewpoints perfect for photography',
//           'Engage with local communities and learn traditional crafts',
//           'Sample regional delicacies not found elsewhere'
//         ]
//       },
//       {
//         name: `${location}'s Best Kept Secret`,
//         whyItFits: `Combines the best of ${interests.join(', ')}.`,
//         uniqueAppeal: 'A perfect mix of adventure and relaxation that most travelers overlook.',
//         activities: [
//           'Participate in unique local activities available only in this region',
//           'Visit historical sites with fascinating stories',
//           'Enjoy breathtaking views while engaging in your favorite activities'
//         ]
//       }
//     ];

//     const response: RecommendationResponse = {
//       recommendations: mockRecommendations
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error('Error processing recommendation request:', error);
//     return res.status(500).json({ 
//       message: 'Failed to generate recommendations' 
//     });
//   }
// }