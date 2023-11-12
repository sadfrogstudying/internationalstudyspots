import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react";
import { type Prisma } from "@prisma/client";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type Props = {
  images: Prisma.ImageGetPayload<Record<string, never>>[];
  name: string;
};

export default function ImageCarousel(props: Props) {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const { images, name } = props;
  const [emblaMainRef, emblaApi] = useEmblaCarousel({});

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <Controls
        scrollPrev={scrollPrev}
        scrollNext={scrollNext}
        prevDisabled={prevBtnDisabled}
        nextDisabled={nextBtnDisabled}
      />
      <div
        className="relative h-fit w-full overflow-hidden rounded-md bg-primary/10"
        ref={emblaMainRef}
      >
        <div className="flex touch-pan-y">
          {images.map((image) => (
            <div
              className="relative w-full"
              style={{ flex: `0 0 100%` }}
              key={image.id}
            >
              <Image
                key={image.id}
                src={image.url}
                alt={`Image of ${name}`}
                width={image.width}
                height={image.height}
                className="aspect-square object-cover sm:aspect-[3/4]"
                sizes="(max-width: 1024px) 40vw, 22vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Controls({
  scrollPrev,
  scrollNext,
  prevDisabled,
  nextDisabled,
}: {
  scrollPrev: () => void;
  scrollNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}) {
  return (
    <div className="user pointer-events-none absolute z-10 grid h-full w-full grid-rows-3">
      <div />
      <div className="invisible flex items-center justify-between p-2 md:visible">
        <button
          className={cn(
            `pointer-events-auto h-fit w-fit rounded bg-white p-2 opacity-0 shadow-md transition-opacity focus:opacity-100 active:bg-lime-200 group-focus-within:opacity-100 group-hover:opacity-100 ${
              prevDisabled &&
              "opacity-0 group-focus-within:opacity-0 group-hover:opacity-0"
            }`,
          )}
          aria-label="Previous image"
          onClick={(e) => {
            e.preventDefault();
            scrollPrev();
          }}
          disabled={prevDisabled}
        >
          <ChevronLeftIcon />
        </button>
        <button
          className={cn(
            `pointer-events-auto h-fit w-fit rounded bg-white p-2 opacity-0 shadow-md transition-opacity focus:opacity-100 active:bg-lime-200 group-focus-within:opacity-100 group-hover:opacity-100 ${
              nextDisabled &&
              "opacity-0 group-focus-within:opacity-0 group-hover:opacity-0"
            }`,
          )}
          aria-label="Next image"
          onClick={(e) => {
            e.preventDefault();
            scrollNext();
          }}
          disabled={nextDisabled}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div />
    </div>
  );
}