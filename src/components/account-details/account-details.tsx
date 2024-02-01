"use client";

import { useParams } from "next/navigation";

import { Skeleton, SkeletonText } from "../ui/skeleton";
import Image from "next/image";
import React from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import UnmountAfter from "@/components/unmount-after";

export default function AccountDetails() {
  const params = useParams<{ username: string }>();
  const { data } = api.user.get.useQuery(params.username);
  const {
    city,
    country,
    email,
    name,
    profileImage,
    username,
    description,
    interests,
    occupation,
    tagline,
    // firstName,
    // lastName,
    // website,
  } = data ?? {};

  const temporaryLoadingState = profileImage?.url;

  return (
    <>
      <section className="relative h-screen max-h-96 w-full object-cover">
        <ImageThatFadesIn
          src={temporaryLoadingState && "/bean.jpg"}
          alt="Posters"
          fill
          imageReady={!!data}
          className="h-full w-full object-cover"
          skeletonClassName="h-full w-full opacity-40"
        />
      </section>
      <section className="mx-auto flex flex-col gap-12 px-4 xs:px-14">
        <div className="relative">
          <div className="flex w-full overflow-hidden">
            <div className="w-32 flex-shrink-0 sm:w-56" />

            <ImageThatFadesIn
              src={profileImage?.url}
              alt={name ?? "User profile picture"}
              width={200}
              height={200}
              imageReady={!!data}
              className="absolute bottom-0 left-0 aspect-square w-32 object-cover sm:w-56"
              skeletonClassName="h-full w-full"
            />

            <div className="flex flex-shrink-0 flex-col gap-0.5 self-end pl-4 pt-4">
              <h2 className="text-xl font-medium">
                <NewSkeletonText textReady={!!data} skeletonClassName="w-36">
                  {name}
                </NewSkeletonText>
              </h2>

              <div className="text-base text-neutral-500">
                <NewSkeletonText textReady={!!data} skeletonClassName="w-48">
                  {city && country && `${city}, ${country}`}
                </NewSkeletonText>
              </div>

              <div className="text-base text-neutral-500">
                <NewSkeletonText textReady={!!data} skeletonClassName="w-72">
                  <Link
                    href="/account/charles/edit"
                    className="max-w-xs truncate rounded-md bg-neutral-200 px-2"
                  >
                    charliezhao.com
                  </Link>
                </NewSkeletonText>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 flex flex-col gap-12 px-4 xs:px-14">
        <div className="max-w-prose">
          <h3 className="font-bold">About</h3>
          <p className="text-neutral-500">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia
            quas deleniti perferendis repudiandae quasi eaque sapiente. Magnam
            maxime quam voluptate delectus dolores harum unde id autem.
            Doloremque sed assumenda soluta.
          </p>
        </div>

        <div className="max-w-prose">
          <h3 className="font-bold">General Info</h3>
          <ul>
            <li>
              <span className="font-medium">Member since: </span>
              <span className="text-neutral-500">3/1/2024</span>
            </li>
            <li>
              <span className="font-medium">Interests: </span>
              <span className="text-neutral-500">
                Tea, coffee, design, music
              </span>
            </li>
            <li>
              <span className="font-medium">Instagram: </span>
              <span className="text-neutral-500">@yourhandlehere</span>
            </li>
            <li>
              <span className="font-medium">Twitter: </span>
              <span className="text-neutral-500">@yourhandlehere</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

type NextImageProps = React.ComponentProps<typeof Image>;
interface ImageThatFadesInProps extends Omit<NextImageProps, "src"> {
  src: NextImageProps["src"] | undefined;
  imageReady: boolean;
  skeletonClassName?: string;
}

function ImageThatFadesIn({
  src,
  imageReady,
  className,
  skeletonClassName,
  ...props
}: ImageThatFadesInProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <>
      {src && (
        <Image
          {...props}
          src={src}
          onLoad={() => setLoaded(true)}
          className={cn(
            className,
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <UnmountAfter delay={1250} ready={imageReady}>
        <div
          className={cn(
            className,
            "rounded-md bg-white transition-opacity duration-500",
            loaded ? "opacity-0" : "opacity-100",
          )}
        >
          <Skeleton className={skeletonClassName} />
        </div>
      </UnmountAfter>
    </>
  );
}

/**
 * Nest this in a container
 *  - The skeleton will fit the container
 *  - It will smoothly fade out the skeleton
 */
function NewSkeletonText({
  children,
  textReady,
  skeletonClassName,
}: {
  children: React.ReactNode;
  textReady: boolean;
  skeletonClassName?: string;
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "h-fit transition-opacity duration-500",
          textReady ? "opacity-100" : "absolute opacity-0",
        )}
      >
        {children}
      </div>

      <UnmountAfter delay={1250} ready={textReady}>
        <SkeletonText
          className={cn(
            "transition-opacity duration-500",
            skeletonClassName,
            textReady ? "absolute top-0 -z-10 opacity-0" : "opacity-100",
          )}
        />
      </UnmountAfter>
    </div>
  );
}
