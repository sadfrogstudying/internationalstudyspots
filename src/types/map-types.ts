export type MarkerData = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  images: { id: number | string; url: string; width: number; height: number }[];
  slug: string;
  venueType: string;
  wifi: boolean;
  powerOutlets: boolean;
  naturalViews: boolean | null;
};
