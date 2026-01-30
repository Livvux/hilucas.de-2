import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/components/ui/link";

const description =
  "Fullstack Developer aus Rastatt, Deutschland. Spezialist für Webdesign, SEO und innovative digitale Lösungen. Open Source für alles.";
const ogTitle = encodeURIComponent("Über mich");
const ogSubtitle = encodeURIComponent("Lucas Kleipödszus");

export const metadata: Metadata = {
  title: "Über mich",
  description,
  openGraph: {
    title: "Über mich",
    description,
    url: "/about",
    images: [
      {
        url: `/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`,
        width: 1200,
        height: 630,
        alt: "Über Lucas Kleipödszus",
      },
    ],
  },
  twitter: {
    title: "Über mich",
    description,
    images: [`/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
      <h1 className="text-[var(--text-heading)] text-3xl font-medium mb-8">
        Über mich
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-auto md:flex-shrink-0 md:max-w-[281px]">
          <Image
            src="/images/avatar.jpg"
            alt="Lucas im Arbeitszimmer"
            width={281}
            height={281}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-4 text-copy">
          <p>Ich bin 1997 in Rastatt geboren und nutze meine Kreativität als Superkraft.</p>
          <p>Fullstack Developer mit Fokus auf Webdesign, SEO und innovative digitale Lösungen.</p>
          <p>Gründer von LK Media – 15+ Jahre Erfahrung mit über 150 Projekten für 50+ Kunden.</p>
          <p>Alles was ich baue, ist Open Source auf GitHub verfügbar.</p>
          <p>Spezialist für Webdesign, WordPress und SEO (insbesondere für Fahrschulen).</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-medium mb-4">GitHub Aktivität</h2>
        <div className="bg-muted rounded-lg overflow-hidden">
          <img
            src="https://ghchart.rshah.org/Livvux"
            alt="Lucas' GitHub Beitrag-Graph"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        <p className="text-copy mt-6">
          Ich baue das, was mich begeistert und veröffentliche alles als Open Source.
        </p>
        <p className="text-copy mt-4">
          <Link href="https://github.com/Livvux" variant="external">
            Folg mir auf GitHub
          </Link>{" "}
          und entdecke mehr über meinen Werdegang.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-medium mb-4">Verbinde dich</h2>
        <p className="text-copy">
          Wenn du dich vernetzen möchtest oder Fragen zu meiner Arbeit hast, erreich
          mich gerne über die Links unten.
        </p>
        <p className="text-copy mt-4">
          Tipp: Ändere hilucas.de zu hilucas.md für die Markdown-Version.
        </p>

        <div className="text-sm text-muted-foreground mt-8">
          <p className="font-semibold mb-2">Impressum</p>
          <p>Lucas Kleipödszus</p>
          <p>Felchenstraße 21</p>
          <p>76437 Rastatt</p>
          <p>Deutschland</p>
          <p className="mt-2">
            E-Mail:{" "}
            <Link href="mailto:mail@hilucas.de">mail@hilucas.de</Link>
          </p>
          <p>
            LinkedIn:{" "}
            <Link href="https://www.linkedin.com/in/lucas-kleipoedszus/" variant="external">
              Profil ansehen
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
