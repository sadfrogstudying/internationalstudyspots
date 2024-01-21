import { useRouter, useSearchParams } from "next/navigation";

export const useMapQueryParams = () => {
  const params = useSearchParams();
  const lat = params.get("lat");
  const lng = params.get("lng");
  const id = Number(params.get("id"));
  const latLng =
    lat && lng
      ? ([parseFloat(lat), parseFloat(lng)] as [number, number])
      : null;

  const router = useRouter();

  function updateMapQueryParams(lat: number, lng: number, id: number) {
    router.replace("/map?" + "lat=" + lat + "&lng=" + lng + "&id=" + id + "", {
      shallow: true,
    });
  }

  function clearMapQueryParams() {
    router.replace("/map", { shallow: true });
  }

  return { latLng, id, updateMapQueryParams, clearMapQueryParams };
};
