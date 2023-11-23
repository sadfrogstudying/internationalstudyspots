import {
  AirVent,
  Armchair,
  Building,
  Building2,
  Clock,
  Coffee,
  Ear,
  Flower,
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
  Zap,
} from "lucide-react";

import { type RouterOutputs } from "@/trpc/shared";
import UnmountAfter from "../unmount-after";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { cn } from "@/lib/utils";
type StudySpot = RouterOutputs["studySpot"]["bySlug"];

export default function List({ studySpot }: { studySpot?: StudySpot }) {
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

  const list = Object.entries(studySpot ?? {}).filter(
    (entry) => !ignoredKeys.includes(entry[0]),
  );

  console.log(list);

  return (
    <ul className="w-full overflow-hidden">
      {studySpot ? (
        list.map((x, i) => {
          const animationDelay = 0;
          const durationTiming = 500;
          const animationDuration = `duration-${durationTiming}`;
          const timingOffset = 200;

          return (
            <li key={`detail-row-${i}`} className="relative">
              <UnmountAfter
                delay={animationDelay + durationTiming + timingOffset}
              >
                <SkeletonRow
                  className={cn(
                    "absolute -z-10 w-full animate-fade-out opacity-0",
                    animationDuration,
                  )}
                  style={{
                    animationDelay: `${animationDelay}ms`,
                    animationFillMode: "backwards",
                  }}
                />
              </UnmountAfter>

              <div
                className={cn(
                  "grid animate-fade-in grid-cols-[3fr_4fr] flex-wrap gap-4 md:grid-cols-[1fr_4fr]",
                  animationDuration,
                )}
                style={{
                  animationDelay: `${animationDelay}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex items-start font-bold">
                  <div className="flex items-center gap-2">
                    {readableKeys[x[0]]?.icon ?? <div className="h-4 w-4" />}
                    {readableKeys[x[0]]?.humanReadable}
                  </div>
                </div>

                <div className="overflow-hidden sm:truncate">
                  {x[1] ? x[1].toString() : "N/A"}
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      )}
    </ul>
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
  naturalViews: {
    humanReadable: "Natural Views",
    icon: <Flower className="h-4 w-4" />,
  },
  studyBreakFacilities: {
    humanReadable: "Study Break Facilities",
    icon: <Armchair className="h-4 w-4" />,
  },
};

function SkeletonRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-full w-full gap-4", className)} {...props}>
      <div className="flex w-56 flex-shrink-0 items-start font-bold">
        <Skeleton className="aspect-square h-6 w-6 border border-white" />
        <SkeletonText />
      </div>
      <div className="w-1/2">
        <SkeletonText className="h-full" />
      </div>
    </div>
  );
}
