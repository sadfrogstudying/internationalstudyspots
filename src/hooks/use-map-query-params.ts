import { createUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useMapQueryParams = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const lat = params.get("lat");
  const lng = params.get("lng");
  const zoomStr = params.get("zoom");
  const id = Number(params.get("id"));

  const zoom = zoomStr ? Number(zoomStr) : undefined;
  const latLng =
    lat && lng
      ? ([parseFloat(lat), parseFloat(lng)] as [number, number])
      : null;

  const router = useRouter();

  function updateMapQueryParams(args: {
    lat?: number;
    lng?: number;
    zoom?: number;
    id?: number;
  }) {
    const newParams = new URLSearchParams(params.toString());

    let arg: keyof typeof args;
    for (arg in args) {
      const value = args[arg];
      if (value == undefined) continue;
      newParams.set(arg, String(value));
    }

    router.replace(createUrl(pathname, newParams), {
      shallow: true,
    });
  }

  function clearMapQueryParams(args: ("lat" | "lng" | "zoom" | "id")[]) {
    const newParams = new URLSearchParams(params.toString());

    args.forEach((arg) => {
      newParams.delete(arg);
    });

    router.replace(createUrl(pathname, newParams), {
      shallow: true,
    });
  }

  return { latLng, zoom, id, updateMapQueryParams, clearMapQueryParams };
};
