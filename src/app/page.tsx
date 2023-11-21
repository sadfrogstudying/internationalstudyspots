import StudySpotGrid from "@/components/study-spot-grid";
import HolyGrailLayout from "@/components/study-spot-grid/holy-grail-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-12 text-sm">
      <section className="max-w-2xl space-y-4 px-8 py-4 lg:px-4">
        <p>An index of beautiful study spots around the world.</p>
        <Button asChild>
          <Link href="/create" className="block">
            Add New
          </Link>
        </Button>
      </section>

      <HolyGrailLayout>
        <StudySpotGrid />
      </HolyGrailLayout>
    </main>
  );
}
