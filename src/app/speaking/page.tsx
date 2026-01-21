import { talks, Talk } from "@/data/talks";
import { TalkCard } from "@/components/TalkCard";

export const metadata = {
  title: "Speaking",
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
  const talksByYear = groupByYear(talks);
  const years = Array.from(talksByYear.keys()).sort((a, b) => b - a);

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
      <h1 className="text-3xl font-medium mb-8">Speaking</h1>

      <p className="text-muted-foreground mb-12">
        Past conference talks, live streams, podcasts, and presentations.
      </p>

      <div className="space-y-16">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-xl font-medium mb-8">{year}</h2>
            <div className="space-y-8">
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
