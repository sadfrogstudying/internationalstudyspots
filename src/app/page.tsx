import StudySpotGrid from "@/components/study-spot-grid";
import HolyGrailLayout from "@/components/study-spot-grid/holy-grail-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-12 text-sm">
      <section className="max-w-2xl space-y-4 px-8 py-4 lg:px-4">
        <p>A convenient index of study spots around the world.</p>
        <p>
          Education should be as broad as man . . . If he is jovial, if he is
          mercurial, if he is a great-hearted, a cunning artificer, a strong
          commander, a potent ally, ingenious, useful, elegant, witty, prophet,
          diviner - society has need of all these. The imagination must be
          addressed. <br /> - <i>Ralph Waldo Emerson</i> 🦧🍎
        </p>
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
