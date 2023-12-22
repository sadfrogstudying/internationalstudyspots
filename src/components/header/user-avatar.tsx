import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Link } from "@/components/ui/link";
import { Button } from "../ui/button";

export default function UserAvatar() {
  const [open, setOpen] = useState(false);
  const { data } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const noUsername = !data?.username;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger>
        <Avatar className="h-9 w-9 shadow">
          <AvatarImage src={data?.profileImage?.url} className="object-cover" />
          <AvatarFallback />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="m-4 text-sm">
        <h3 className="mb-2 font-semibold">Account</h3>
        {noUsername ? (
          <>
            <p className="text-gray-500">
              You need to finish creating your account before you can add spots
              and view your profile.
            </p>
            <Button asChild className="mt-4" variant="success">
              <Link href={`/account/edit`} onClick={() => setOpen(false)}>
                Finish Account
              </Link>
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-500">
              Signed in as{" "}
              <span className="font-semibold">{data?.username}</span>
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
            </p>
          </>
        )}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="mt-4 h-auto w-full rounded"
          src="/orangutang.mp4"
        />
      </PopoverContent>
    </Popover>
  );
}
{
  /* <Link
    aria-disabled={!data}
    href={`/account/${data?.username}`}
    className={cn(
      "pointer-events-auto rounded text-right",
      !data && "pointer-events-none opacity-30",
    )}
    >
        </Link> */
}
