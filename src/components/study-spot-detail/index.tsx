"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import {
  AirVent,
  Armchair,
  Building,
  Building2,
  Clock,
  Coffee,
  Ear,
  Flower2,
  Globe,
  Landmark,
  Lightbulb,
  Link,
  MapPin,
  MapPinned,
  Music,
  PersonStanding,
  Speech,
  Star,
  Sun,
  Text,
  Thermometer,
  Utensils,
  Wifi,
  WifiOff,
  Zap,
  ZapOff,
} from "lucide-react";

interface Props {
  slug: string;
}

export default function StudySpotDetail({ slug }: Props) {
  const { data } = api.studySpot.bySlug.useQuery(slug, {
    refetchOnWindowFocus: false,
  });

  const ignoredKeys = [
    "id",
    "name",
    "isValidated",
    "authorId",
    "slug",
    "images",
    "createdAt",
    "updatedAt",
    "latitude",
    "longitude",
    "placeId",
  ];

  const list = Object.entries(data ?? {}).filter(
    (entry) => !ignoredKeys.includes(entry[0]),
  );

  return (
    <div className="max-w-7xl space-y-12 p-4">
      <div className="text-lg font-bold">{data?.name}</div>
      <div className="grid grid-cols-5 gap-4">
        {data?.images
          .slice(0, 5)
          .map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt={`Image of ${data?.name}`}
              width={image.width}
              height={image.height}
              className="aspect-[3/4] w-full min-w-0 object-cover"
              sizes="(max-width: 1024px) 40vw, 22vw"
            />
          ))}
      </div>

      <div>
        <Separator className="mb-2" />
        {data && (
          <ul>
            <li className="truncate text-ellipsis font-bold">
              {data.state}, {data.country}
            </li>
            <li>
              <h2 className="truncate text-ellipsis">{data.name}</h2>
            </li>
            <li className="truncate text-ellipsis">{data.venueType}</li>
            <li>
              <ul className="flex gap-2">
                <li className="truncate text-ellipsis">
                  {data.wifi ? <Wifi /> : <WifiOff />}
                </li>
                <li className="truncate text-ellipsis">
                  {data.powerOutlets ? <Zap /> : <ZapOff />}
                </li>
              </ul>
            </li>
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <Separator className="mb-2" />
        <ul className="w-full overflow-hidden">
          {list.map((x, i) => (
            <li key={`detail-row-${i}`} className="flex flex-wrap gap-4">
              <div className="flex w-56 flex-shrink-0 items-start font-bold">
                <div className="flex items-center gap-2">
                  {readableKeys[x[0]]?.icon ?? <div className="h-4 w-4" />}
                  {readableKeys[x[0]]?.humanReadable}
                </div>
              </div>
              <div className="w-1/2">{x[1]?.toString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Separator className="mb-2" />
        <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
          {data?.images.map((image) => (
            <Image
              key={`all-images-item-${image.id}`}
              src={image.url}
              alt={`Image of ${data?.name}`}
              width={image.width}
              height={image.height}
              className="aspect-square object-cover"
              sizes="(max-width: 768px) 30vw, 22vw"
            />
          ))}
        </div>
        <div className="space-y-4">
          <i className="block"> page slug: {slug}</i>
        </div>
      </div>
    </div>
  );
}

const readableKeys: Partial<
  Record<
    string,
    {
      humanReadable: string;
      icon?: React.ReactNode;
    }
  >
> = {
  name: { humanReadable: "Name" },
  rating: { humanReadable: "Rating", icon: <Star className="h-4 w-4" /> },
  website: { humanReadable: "Website", icon: <Link className="h-4 w-4" /> },
  wifi: { humanReadable: "Wifi", icon: <Wifi className="h-4 w-4" /> },
  powerOutlets: {
    humanReadable: "Power Outlets",
    icon: <Zap className="h-4 w-4" />,
  },
  description: {
    humanReadable: "Description",
    icon: <Text className="h-4 w-4" />,
  },
  noiseLevel: {
    humanReadable: "Noise Level",
    icon: <Ear className="h-4 w-4" />,
  },
  venueType: {
    humanReadable: "Venue Type",
    icon: <Building className="h-4 w-4" />,
  },
  address: { humanReadable: "Address", icon: <MapPin className="h-4 w-4" /> },
  country: { humanReadable: "Country", icon: <Globe className="h-4 w-4" /> },
  city: { humanReadable: "City", icon: <Building2 className="h-4 w-4" /> },
  state: { humanReadable: "State", icon: <Landmark className="h-4 w-4" /> },
  canStudyForLong: {
    humanReadable: "Can Study For Long",
    icon: <Clock className="h-4 w-4" />,
  },
  comfort: { humanReadable: "Comfort", icon: <AirVent className="h-4 w-4" /> },
  views: { humanReadable: "Views", icon: <Flower2 className="h-4 w-4" /> },
  sunlight: { humanReadable: "Sunlight", icon: <Sun className="h-4 w-4" /> },
  temperature: {
    humanReadable: "Temperature",
    icon: <Thermometer className="h-4 w-4" />,
  },
  music: { humanReadable: "Music", icon: <Music className="h-4 w-4" /> },
  lighting: {
    humanReadable: "Lighting",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  distractions: {
    humanReadable: "Distractions",
    icon: <Speech className="h-4 w-4" />,
  },
  crowdedness: {
    humanReadable: "Crowdedness",
    icon: <PersonStanding className="h-4 w-4" />,
  },
  proximityToAmenities: {
    humanReadable: "Proximity To Amenities",
    icon: <MapPinned className="h-4 w-4" />,
  },
  drinks: { humanReadable: "Drinks", icon: <Coffee className="h-4 w-4" /> },
  food: { humanReadable: "Food", icon: <Utensils className="h-4 w-4" /> },
  studyBreakFacilities: {
    humanReadable: "Study Break Facilities",
    icon: <Armchair className="h-4 w-4" />,
  },
};
