"use client";
import StudySpotGrid from "@/components/study-spot-grid";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { AvatarIcon } from "@radix-ui/react-icons";
import { type VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import { Fragment } from "react";

export default function AccountPage() {
  const { user, error, isLoading } = useUser();

  if (isLoading)
    return (
      <main className="w-full bg-neutral-100 p-4 text-sm">Loading...</main>
    );
  if (error)
    return (
      <main className="w-full bg-neutral-100 p-4 text-sm">{error.message}</main>
    );

  if (user) {
    return (
      <main className="w-full bg-neutral-100 p-4 text-sm">
        <div className="max-w-6xl grid-cols-[3.5fr_7fr] flex-wrap gap-4 md:grid">
          <div className="flex flex-col gap-4 border bg-white p-4">
            <Left />
          </div>
          <div className="flex flex-col gap-4 border bg-white p-4">
            <Right />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-neutral-100 p-4 text-sm">
      <a href="/api/auth/login">Login</a>
    </main>
  );
}

function Left() {
  const { data } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { username, profilePicture } = data ?? {};

  const generalInfo = [
    { label: "Member Since", value: "3/1/2010" },
    { label: "Last Login", value: "3/1/2010" },
    {
      label: "Influences",
      value: "Too many to list.  They include Pink, U2, Avi and more.",
    },
    { label: "Interests", value: "House, Electronic and picnics." },
  ];

  return (
    <>
      <div className="relative">
        <h2 className="text-xl font-bold">
          {username ?? <SkeletonText className="w-36" />}
        </h2>
        {username ? (
          <ul>
            <li className="inline">Indie / </li>
            <li className="inline">Pop / </li>
            <li className="inline">Rock </li>
          </ul>
        ) : (
          <ul>
            <SkeletonText className="w-64" />
          </ul>
        )}
      </div>
      <section className="relative flex flex-wrap items-center gap-4 rounded">
        <div>
          {profilePicture ? (
            <Image
              src={profilePicture?.url}
              width={profilePicture?.width}
              height={profilePicture?.height}
              alt={profilePicture?.name ?? "Profile Picture"}
              className="aspect-square w-36 overflow-hidden object-cover"
            />
          ) : (
            <Skeleton className="aspect-square w-36" />
          )}
        </div>

        <div className="flex flex-col">
          <div>Seattle</div>
          <div>United States</div>
          <br />
          <div>Profile Views: 208</div>
          <div className="flex items-center gap-1 text-success">
            <AvatarIcon className="h-4 w-4" fill="#000" /> Online Now!
          </div>
        </div>
      </section>

      <Section title="Contacting Pei Pei">
        <ul className="grid grid-cols-2">
          <li>
            <a
              href="https://www.instagram.com/portrait_of_innocent_x/"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/PeiPeiMusic"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/peipeimusic"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/PeiPeiMusic"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/peipeimusic"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Twitter
            </a>
          </li>
        </ul>
      </Section>

      <Section title="Pei Pei: General Info">
        <div className="grid grid-cols-[2fr_3fr] gap-1">
          {generalInfo.map(({ label, value }) => (
            <Fragment key={label}>
              <div className="bg-blue-200 p-1 font-bold text-blue-400">
                {label}
              </div>
              <div className="bg-blue-100 p-1">{value}</div>
            </Fragment>
          ))}
        </div>
      </Section>
    </>
  );
}

function Right() {
  return (
    <>
      <div className="relative h-48 w-full border bg-neutral-100">
        <Image
          src="/trees.jpg"
          alt="Trees"
          sizes="50rem"
          fill
          className="object-cover"
          priority
        />
      </div>
      <Section title="Featured Video" variant="ghost">
        <iframe
          className="aspect-[16/9] h-full w-full"
          src="https://www.youtube.com/embed/3czSVBKpcJc?si=Ve4QaQr1nQYcXreA"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Section>
      <Section title="About Pei Pei" variant="alternate">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae
          provident ad officia consectetur neque reprehenderit illum saepe
          accusantium, ut enim laboriosam odit maxime ea, doloribus mollitia
          iure voluptatum, rerum libero! Necessitatibus cum qui, dolorum ipsa ab
          eveniet accusantium non modi doloremque quisquam officia quidem, omnis
          ipsum.
        </p>
        <br />
        <p>
          Excepturi commodi veniam ratione rem reiciendis odio. Culpa cumque
          fuga architecto autem recusandae alias! Voluptates eligendi molestias
          vitae praesentium soluta quam ullam qui. Suscipit ipsam odit molestias
          magni, molestiae sunt nesciunt consequuntur laudantium corrupti
          laborum, ea quidem eveniet voluptatem tenetur! Dicta minus cumque
          reiciendis!
        </p>
      </Section>
      <Section title="Study Spots">
        <div className="p-2">
          <StudySpotGrid />
        </div>
      </Section>
    </>
  );
}

const sectionVariants = cva("", {
  variants: {
    variant: {
      default: "border border-blue-400",
      alternate: "",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const headerVariants = cva("px-6 text-base font-bold text-primary-foreground", {
  variants: {
    variant: {
      default: "bg-blue-400",
      alternate: "bg-orange-300 text-orange-500",
      ghost: "sr-only",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const contentVariants = cva("", {
  variants: {
    variant: {
      default: "p-2",
      alternate: "p-2",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SectionProps extends VariantProps<typeof sectionVariants> {
  title: string;
  children: React.ReactNode;
}

function Section({ children, title, variant }: SectionProps) {
  return (
    <section className={cn(sectionVariants({ variant }))}>
      <h3 className={cn(headerVariants({ variant }))}>{title}</h3>
      <div className={cn(contentVariants({ variant }))}>{children}</div>
    </section>
  );
}
