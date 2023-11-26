import StudySpotGrid from "@/components/study-spot-grid";
import HolyGrailLayout from "@/components/study-spot-grid/holy-grail-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-12 text-sm">
      <section className="max-w-2xl space-y-4 px-4 py-4">
        <p>An index of beautiful study spots around the world.</p>
        <p className="font-bold text-purple-500">
          This site is still a WIP, account creation and adding spots is
          currently not implemented. Please visit{" "}
          <a
            href="https://sadfrogs-nextjs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            version 1
          </a>{" "}
          to use those features.
        </p>
        <p>Differences to version 1:</p>
        <ul className="ml-4 list-disc">
          <li>Updated UI</li>
          <li>Integration and E2E tests</li>
          <li>Improved code architecture to promote scalability</li>
        </ul>
        <Button variant="success" asChild>
          <Link href="/create" className="block">
            Add Spot
          </Link>
        </Button>
      </section>

      <HolyGrailLayout>
        <StudySpotGrid />
      </HolyGrailLayout>
    </main>
  );
}
