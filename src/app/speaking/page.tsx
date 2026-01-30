import type { Metadata } from "next";
import { talks, Talk } from "@/data/talks";
import { TalkCard } from "@/components/talk-card";

const description =
  "Vorträge, Podcasts und Präsentationen rund um Webdesign, SEO und Development.";
const ogTitle = encodeURIComponent("Vorträge");
const ogSubtitle = encodeURIComponent("Talks und Präsentationen");

export const metadata: Metadata = {
  title: "Vorträge",
  description,
  openGraph: {
    title: "Vorträge",
    description,
    url: "/speaking",
    images: [
      {
        url: `/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`,
        width: 1200,
        height: 630,
        alt: "Vorträge von Lucas Kleipödszus",
      },
    ],
  },
  twitter: {
    title: "Vorträge",
    description,
    images: [`/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`],
  },
  alternates: {
    canonical: "/speaking",
  },
};

// Group talks by year
function groupByYear(talks: Talk[]): Map<number, Talk[]> {
  const grouped = new Map<number, Talk[]>();

  for (const talk of talks) {
    const year = new Date(talk.date).getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push(talk);
  }

  return grouped;
}

export default function SpeakingPage() {
  if (talks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
        <h1 className="text-3xl font-medium mb-4">Vorträge</h1>
        <p className="text-copy">
          Aktuell gibt es keine öffentlichen Talks oder Podcasts. Wenn sich das
          ändert, findest du die Termine hier.
        </p>
      </div>
    );
  }

  const talksByYear = groupByYear(talks);
  const years = Array.from(talksByYear.keys()).sort((a, b) => b - a);

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
      <h1 className="text-3xl font-medium mb-4">Vorträge</h1>

      <p className="text-copy mb-12">
        Vergangene Konferenz-Talks, Livestreams, Podcasts und Präsentationen.
      </p>

      <div className="space-y-16">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-2xl font-medium mb-6">{year}</h2>
            <div className="space-y-6 sm:space-y-8">
              {talksByYear.get(year)!.map((talk) => (
                <TalkCard key={`${talk.title}-${talk.date}`} talk={talk} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
