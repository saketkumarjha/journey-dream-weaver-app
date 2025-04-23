
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type TripType = 'adventure' | 'leisure' | 'work' | 'family' | 'romantic' | 'solo' | 'other';

export interface Trip {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  destination: string;
  tripType: TripType;
  userId: string;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
}

export interface Activity {
  id?: string;
  tripId: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  cost?: number;
  notes?: string;
  imageUrl?: string;
}
