import type { Metadata } from "next";
import { Link } from "@/components/ui/link";

const description =
  "Open-Source-Projekte und Experimente rund um Webdesign, SEO und Automatisierung.";
const ogTitle = encodeURIComponent("Projekte");
const ogSubtitle = encodeURIComponent("Open-Source und digitale Lösungen");

export const metadata: Metadata = {
  title: "Projekte",
  description,
  openGraph: {
    title: "Projekte",
    description,
    url: "/projects",
    images: [
      {
        url: `/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`,
        width: 1200,
        height: 630,
        alt: "Projekte von Lucas Kleipödszus",
      },
    ],
  },
  twitter: {
    title: "Projekte",
    description,
    images: [`/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`],
  },
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
      <h1 className="text-3xl font-medium mb-4">Projekte</h1>

      <p className="text-copy mb-6">
        Ich entwickle digitale Lösungen mit Fokus auf Webdesign, SEO und
        Automatisierung. Viele meiner Projekte sind Open Source und entstehen
        aus echten Kundenanforderungen.
      </p>

      <p className="text-copy mb-10">
        Eine Übersicht findest du auf{" "}
        <Link href="https://github.com/Livvux" variant="external">
          GitHub
        </Link>
        . Wenn du Fragen hast oder an einer Zusammenarbeit interessiert bist,
        schreib mir gern.
      </p>

      <section className="space-y-4 text-copy">
        <h2 className="text-2xl font-medium">Schwerpunkte</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Webdesign, UX und Conversion-Optimierung</li>
          <li>SEO-Strategien für lokale Unternehmen und Fahrschulen</li>
          <li>Automatisierung und AI-gestützte Workflows</li>
          <li>Open-Source-Experimente und Prototypen</li>
        </ul>
      </section>
    </div>
  );
}
