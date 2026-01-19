import { talks, Talk, TalkCategory } from '@/data/talks';
import { Mic2, Video, Headphones, Users } from 'lucide-react';

export const metadata = {
  title: 'Speaking',
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const categoryIcons: Record<TalkCategory, React.ReactNode> = {
  conference: <Mic2 className="size-4" />,
  'live stream': <Video className="size-4" />,
  video: <Video className="size-4" />,
  podcast: <Headphones className="size-4" />,
  workshop: <Users className="size-4" />,
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
        Conference talks, live streams, podcasts, and presentations about
        WordPress development, the block editor, and related topics.
      </p>

      <div className="space-y-12">
        {years.map((year) => (
          <section key={year}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-medium">
                {year}
              </h2>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {talksByYear.get(year)!.length}
              </span>
            </div>
            <div className="space-y-6">
              {talksByYear.get(year)!.map((talk) => {
                const date = dateFormatter.format(new Date(talk.date));

                return (
                  <div
                    key={`${talk.title}-${talk.date}`}
                    className="border-b border-border pb-6 last:border-0"
                  >
                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">
                          {categoryIcons[talk.category]}
                        </span>
                        <span>{talk.event}</span>
                      </div>
                      <span className="shrink-0">{date}</span>
                    </div>
                    <h3 className="text-lg font-medium text-balance max-w-[90%]">
                      {talk.recordingUrl ? (
                        <a
                          href={talk.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-muted-foreground transition-colors"
                        >
                          {talk.title}
                        </a>
                      ) : talk.url ? (
                        <a
                          href={talk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-muted-foreground transition-colors"
                        >
                          {talk.title}
                        </a>
                      ) : (
                        talk.title
                      )}
                    </h3>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
