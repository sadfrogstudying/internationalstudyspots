import AccountDetails from "@/components/account-details";
import {
  type Metadata,
  // type ResolvingMetadata
} from "next";

type Props = {
  params: { username: string };
};

export function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Metadata {
  // read route params
  const username = params.username;

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images ?? []
  return {
    title: username
      ? `${username} - International Study Spots`
      : "International Study Spots",
    description: `User page for ${username}`,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

export default function AccountPage() {
  return (
    <main className="w-full bg-neutral-100 p-4 text-sm">
      <AccountDetails />
    </main>
  );
}
