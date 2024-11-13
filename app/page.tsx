import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Tv, Car, Waves, Dumbbell, PawPrint } from "lucide-react";
import { Ad } from "@/lib/models/ad";
import { getAds } from "@/lib/api/ads.service";

function AmenityIcon({
  amenity,
  value,
}: {
  amenity: keyof Ad["property"]["amenities"];
  value: boolean;
}) {
  const icons = {
    wifi: Wifi,
    tv: Tv,
    parking: Car,
    pool: Waves,
    gym: Dumbbell,
    petFriendly: PawPrint,
  };

  const IconComponent = icons[amenity as keyof typeof icons];

  if (!IconComponent || !value) return null;

  return <IconComponent className="w-4 h-4 text-muted-foreground" />;
}

export default async function Home() {
  const ads = (await getAds()).results;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad) => (
        <Card key={ad.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={
                ad?.pictures[0]?.url || "https://via.placeholder.com/400x200"
              }
              alt={ad.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{ad.title}</CardTitle>
            <CardDescription>
              {ad.property.address.city}, {ad.property.address.country}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {ad.description}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">
                {ad.property.price.amount} {ad.property.price.currency}/
                {ad.property.price.unit}
              </span>
              <Badge>{ad.property.type}</Badge>
            </div>
            <div className="flex space-x-2 mb-4">
              <span className="text-sm">
                {ad.property.capacity.rooms} rooms
              </span>
              <span className="text-sm">{ad.property.capacity.beds} beds</span>
              <span className="text-sm">
                {ad.property.capacity.bathrooms} baths
              </span>
            </div>
            <div className="flex space-x-2">
              <AmenityIcon amenity="wifi" value={ad.property.amenities.wifi} />
              <AmenityIcon amenity="tv" value={ad.property.amenities.tv} />
              <AmenityIcon
                amenity="parking"
                value={ad.property.amenities.parking}
              />
              <AmenityIcon amenity="pool" value={ad.property.amenities.pool} />
              <AmenityIcon amenity="gym" value={ad.property.amenities.gym} />
              <AmenityIcon
                amenity="petFriendly"
                value={ad.property.amenities.petFriendly}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-2">
              <Image
                src={
                  ad.property.ownerInfo.profilePicture ||
                  "https://via.placeholder.com/40"
                }
                alt={ad.property.ownerInfo.fullname}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-sm font-medium">
                {ad.property.ownerInfo.fullname}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
