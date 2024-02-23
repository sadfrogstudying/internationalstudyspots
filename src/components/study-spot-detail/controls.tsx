"use client";

import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { Link } from "../ui/link";
import { api } from "@/trpc/react";

const DeleteAlertDialog = dynamic(
  () => import("../study-spot-grid/delete-alert-dialog"),
);

export default function Controls({ slug }: { slug: string }) {
  const { data: spot } = api.studySpot.bySlug.useQuery(slug);
  const { data: user } = api.user.currentBySession.useQuery(undefined);
  const { data: author } = api.studySpot.authorBySlug.useQuery(slug);

  const currUserIsAuthor =
    user?.username == null || author?.username == null
      ? false
      : user?.username === author?.username;

  return (
    <>
      <Button asChild>
        <Link href={`/study-spot/${slug}/edit`}>Edit Spot</Link>
      </Button>
      {!!currUserIsAuthor && spot?.id && <DeleteAlertDialog id={spot.id} />}
    </>
  );
}
