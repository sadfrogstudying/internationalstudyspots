"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Fragment } from "react";
import StudySpotGrid from "../study-spot-grid";
import Section from "./section";
import { api } from "@/trpc/react";

export default function AccountDetails() {
  return (
    <>
      <div className="grid-cols-[3.5fr_7fr] flex-wrap gap-4 md:grid">
        <div className="flex flex-col gap-4 border bg-white p-4">
          <Left />
        </div>
        <div className="flex flex-col gap-4 border bg-white p-4">
          <Right />
        </div>
      </div>
    </>
  );
}

function Left() {
  const params = useParams<{ username: string }>();

  const { data, isLoading } = api.user.get.useQuery(params.username);

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data for this user!</div>;

  const generalInfo = [
    { label: "Member Since", value: "3/1/2010" },
    { label: "Last Login", value: "3/1/2010" },
    {
      label: "Influences",
      value: "Polish poster art",
    },
    { label: "Interests", value: data?.interests },
  ];

  return (
    <>
      <div className="relative">
        <h2 className="text-xl font-bold">{data?.name}</h2>
        <ul>
          <li className="inline">Indie / </li>
          <li className="inline">Pop / </li>
          <li className="inline">Rock </li>
        </ul>
      </div>
      <section className="relative flex flex-wrap items-center gap-4 rounded">
        <div>
          <Skeleton className="aspect-square w-36" />
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

      <Section title={`Contacting ${data?.name}`}>
        <ul className="grid grid-cols-2">
          <li>
            <a
              href="https://www.instagram.com/dogs.lovers/"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/dogs.lovers/"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/dogs.lovers/"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/dogs.lovers/"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/dogs.lovers/"
              className="text-bold text-blue-600 hover:underline"
              target="_blank"
            >
              Twitter
            </a>
          </li>
        </ul>
      </Section>

      <Section title={`${data?.name}: General Info`}>
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
  const params = useParams<{ username: string }>();

  const { data, isLoading } = api.user.get.useQuery(params.username);

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data for this user!</div>;

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
      <Section title={`About ${data?.name}`} variant="alternate">
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
      <Section title={`Study Spots Found by ${data?.name}`}>
        <div className="p-2">
          <StudySpotGrid />
        </div>
      </Section>
    </>
  );
}
