"use client";

import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { useState } from "react";
import { Link } from "@/components/ui/link";
import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";

export default function UserAvatarPopover() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Button
        asChild
        className="flex h-fit rounded-full p-0"
        size="icon"
        variant="ghost"
      >
        <PopoverTrigger className="pointer-events-auto">
          <Avatar className="h-9 w-9 shadow">
            <AvatarImage
              src={data?.profileImage?.url}
              className="object-cover"
            />
            <AvatarFallback>
              {data?.name?.[0]?.toUpperCase() ?? ":)"}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
      </Button>
      <PopoverContent
        className="pointer-events-auto mt-4 text-sm"
        align="end"
        aria-label="Account"
      >
        <h3 className="mb-2 font-semibold">Account</h3>
        <Content
          loading={isLoading}
          noUsername={!data?.username}
          notLoggedIn={!data}
          setOpen={setOpen}
        />
      </PopoverContent>
    </Popover>
  );
}

function Content({
  noUsername,
  notLoggedIn,
  loading,
  setOpen,
}: {
  noUsername: boolean;
  notLoggedIn: boolean;
  loading: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const apiUtils = api.useUtils();

  const cachedUserData = apiUtils.user.currentBySession;
  const data = cachedUserData.getData();

  if (notLoggedIn)
    return (
      <>
        <p className="text-gray-500">
          You need to be signed in to add spots and view your profile.
        </p>
        <Button
          onClick={() => signIn(undefined, { callbackUrl: `/account` })}
          variant="success"
          className="mt-4"
        >
          Sign In
        </Button>
      </>
    );

  if (loading)
    return (
      <>
        <p className="text-gray-500">Loading...</p>
      </>
    );

  if (noUsername)
    return (
      <>
        <p className="text-gray-500">
          Please finish creating your account to add spots.
        </p>
        <div className="space-y-2">
          <Button asChild className="mt-4 w-full" variant="success">
            <Link href={`/account/edit`} onClick={() => setOpen(false)}>
              Finish Account
            </Link>
          </Button>

          <SignOutButton setOpen={setOpen} />
        </div>
      </>
    );

  return (
    <>
      <p className="text-gray-500">
        Signed in as <span className="font-semibold">{data?.username}</span>
      </p>
      <p className="text-gray-500">
        Edit your account{" "}
        <Link
          href={`/account/edit`}
          className="underline"
          onClick={() => setOpen(false)}
        >
          here
        </Link>
        .
      </p>
      <br />
      <p className="text-gray-500">
        Check out your account{" "}
        <Link
          href={`/account/${data?.username}`}
          className="underline"
          onClick={() => setOpen(false)}
        >
          here
        </Link>{" "}
        (work in progress).
      </p>

      <div className="space-y-2">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="mt-4 h-auto w-full rounded"
          src="/orangutang.mp4"
        />

        <SignOutButton setOpen={setOpen} />
      </div>
    </>
  );
}

function SignOutButton({ setOpen }: { setOpen: (value: boolean) => void }) {
  return (
    <Button
      className="group relative w-full overflow-hidden"
      onClick={() => {
        setOpen(false);
        void signOut({
          callbackUrl: "/",
        });
      }}
      variant="destructive"
    >
      Sign Out
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute -top-6 translate-x-10 scale-150 opacity-0 duration-1000 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
        src="/orangutang.mp4"
      />
    </Button>
  );
}
