"use client";

import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { Link } from "../ui/link";
import { api } from "@/trpc/react";

const DeleteAlertDialog = dynamic(
  () => import("../study-spot-grid/delete-alert-dialog"),
);

export default function Controls({ id }: { id: number }) {
  const { data: spot } = api.studySpot.byId.useQuery(id);
  const { data: user } = api.user.currentBySession.useQuery(undefined, {
    retryOnMount: false,
    staleTime: 1000 * 60,
  });
  const { data: author } = api.studySpot.authorById.useQuery(id, {
    staleTime: Infinity,
  });

  const currUserIsAuthor =
    user?.username == null || author?.username == null
      ? false
      : user?.username === author?.username;

  return (
    <>
      <Button asChild>
        <Link href={`/study-spot/${id}/edit`}>Edit Spot</Link>
      </Button>
      {!!currUserIsAuthor && spot?.id && <DeleteAlertDialog id={spot.id} />}
    </>
  );
}
