import { Link } from "@/components/ui/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import Image from "next/image";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12 space-y-16 md:space-y-24">
      <section className="flex flex-col sm:flex-row gap-8 items-center">
        <div>
          <h1 className="text-4xl font-medium mb-4">Hallo, ich bin @Livvux.</h1>
          <p className="text-copy leading-relaxed">
            Fullstack Developer aus Rastatt, Deutschland. Spezialist für
            Webdesign, SEO und innovative digitale Lösungen. Alles als Open
            Source auf GitHub verfügbar. Schreib mir gern über{" "}
            <Link href="https://x.com/Livvux">@Livvux</Link>.
          </p>
        </div>
        <div className="flex hidden sm:block flex-shrink-0">
          <Image
            src="/images/avatar.jpg"
            alt="Lucas Kleipödszus"
            width={156}
            height={156}
            className="rounded-full"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-medium mb-6">Aktuelle Beiträge</h2>

        {posts.length > 0 ? (
          <div className="space-y-6 sm:space-y-8 mb-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-copy mb-8">
            Noch keine Beiträge. Lege MDX-Dateien in{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded-md">
              src/blog/
            </code>{" "}
            an, um loszulegen.
          </p>
        )}

        <div className="flex justify-end">
          <Link href="/writing" variant="muted" className="text-sm">
            Alle Beiträge →
          </Link>
        </div>
      </section>
    </div>
  );
}
