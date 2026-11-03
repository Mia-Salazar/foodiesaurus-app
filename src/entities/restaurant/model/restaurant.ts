export type Restaurant = {
  id: number;
  name: string;
  province: string;
  address: string;
  zip?: string;
  url?: string;
  phone?: string;
  foodType?: string;
  latitude?: number;
  longitude?: number;
  score?: number;
};

export type RestaurantAverages = {
  general: number;
  totalReviews: number;
};

export type RestaurantDetail = {
  id: number;
  name: string;
  province: string;
  address: string;
  zip?: string;
  url?: string;
  phone?: string;
  foodType?: string;
  averages: RestaurantAverages | null;
};
