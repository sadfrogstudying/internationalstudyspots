import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type Props = {
  images: {
    id: number | string;
    url: string;
    width: number;
    height: number;
  }[];
  name: string;
  sizes?: string;
  priority?: boolean;
  controlsAlwaysVisible?: boolean;
};

export default function ImageCarousel(props: Props) {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const { images, name, sizes } = props;
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
    <div className="relative h-full w-full">
      <Controls
        scrollPrev={scrollPrev}
        scrollNext={scrollNext}
        prevDisabled={prevBtnDisabled}
        nextDisabled={nextBtnDisabled}
        alwaysVisible={props.controlsAlwaysVisible}
      />
      <div
        className="relative h-fit w-full overflow-hidden bg-primary/10"
        ref={emblaMainRef}
      >
        <div className="flex touch-pan-y">
          {images.map((image, i) => (
            <div
              className="relative aspect-square h-full w-full sm:aspect-[3/4]"
              style={{ flex: `0 0 100%` }}
              key={image.id}
            >
              <Image
                key={image.id}
                src={image.url}
                alt={`Image of ${name}`}
                className="w-full object-cover"
                fill
                sizes={sizes}
                priority={i === 0 ? props.priority : false}
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
  alwaysVisible,
}: {
  scrollPrev: () => void;
  scrollNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  alwaysVisible?: boolean;
}) {
  const disabledClass =
    "opacity-0 group-focus-within:opacity-0 group-hover:opacity-0";
  return (
    <div className="user pointer-events-none absolute z-10 grid h-full w-full grid-rows-3">
      <div />
      <div
        className={cn(
          "invisible flex items-center justify-between p-2 md:visible",
          alwaysVisible && "visible",
        )}
      >
        <button
          className={cn(
            "pointer-events-auto flex h-fit w-fit items-center justify-center rounded bg-white p-2 opacity-0 shadow-md transition-opacity focus:opacity-70 active:bg-lime-200 disabled:opacity-0 group-focus-within:opacity-70 group-hover:opacity-70 md:h-9 md:w-9",
            alwaysVisible && "opacity-70",
            prevDisabled && disabledClass,
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
            "pointer-events-auto flex h-fit w-fit items-center justify-center rounded bg-white p-2 opacity-0 shadow-md transition-opacity focus:opacity-70 active:bg-lime-200 disabled:opacity-0 group-focus-within:opacity-70 group-hover:opacity-70 md:h-9 md:w-9",
            alwaysVisible && "opacity-70",
            nextDisabled && disabledClass,
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
