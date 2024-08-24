"use client";

import { useParams } from "next/navigation";

import { SkeletonText } from "@/components/ui/skeleton";
import { ImageThatFadesIn } from "@/components/image-that-fades-in";
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
    // email,
    name,
    profileImage,
    // instagram,
    // linkedin,
    // twitter,
    website,
    // username,
    // description,
    // interests,
    // occupation,
    // tagline,
    profileCover,
  } = data ?? {};

  return (
    <>
      <section className="relative h-screen max-h-96 w-full object-cover">
        <ImageThatFadesIn
          src={profileCover?.image?.url}
          alt="Profile cover"
          fill
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
              className="absolute bottom-0 left-0 aspect-square h-auto w-32 object-cover sm:w-56"
              skeletonClassName="h-full w-full"
            />

            <div className="flex h-24 flex-shrink-0 flex-col justify-end gap-0.5 self-end pl-4 pt-4">
              <h2 className="text-xl font-medium">
                <NewSkeletonText skeletonClassName="w-48">
                  {name ?? "No name set"}
                </NewSkeletonText>
              </h2>

              <div className="text-base text-neutral-500">
                <NewSkeletonText skeletonClassName="w-48">
                  {city ?? country ? (
                    <>
                      {city && country
                        ? `${city}, ${country}`
                        : city ?? country}
                    </>
                  ) : (
                    "No location set"
                  )}
                </NewSkeletonText>
              </div>

              <div className="text-base text-neutral-500">
                <NewSkeletonText skeletonClassName="w-48">
                  {website ? (
                    <Link
                      href="/account/charles/edit"
                      className="max-w-xs truncate rounded-md bg-neutral-200 px-2"
                    >
                      {website}
                    </Link>
                  ) : (
                    <span className="max-w-xs truncate rounded-md bg-neutral-200 px-2">
                      No website
                    </span>
                  )}
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

/**
 * Nest this in a container
 *  - The skeleton will fit the container
 *  - It will smoothly fade out the skeleton
 *  - Since I'm going to SSR account details
 */
function NewSkeletonText({
  children,
  skeletonClassName,
}: {
  children: React.ReactNode;
  skeletonClassName?: string;
}) {
  return (
    <div className="relative">
      <div className={cn("h-fit animate-fade-in fill-mode-backwards")}>
        {children}
      </div>

      <UnmountAfter delay={1250}>
        <SkeletonText
          className={cn(
            "absolute bottom-0 animate-fade-out fill-mode-forwards",
            skeletonClassName,
          )}
        />
      </UnmountAfter>
    </div>
  );
}
