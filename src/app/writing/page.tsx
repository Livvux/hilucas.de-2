import type { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { CategoryNav } from "@/components/category-nav";

const description =
  "Artikel und Updates zu Webdesign, SEO, KI-Tools und Open-Source-Projekten.";
const ogTitle = encodeURIComponent("Beiträge");
const ogSubtitle = encodeURIComponent("Aktuelle Artikel und Updates");

export const metadata: Metadata = {
  title: "Beiträge",
  description,
  openGraph: {
    title: "Beiträge",
    description,
    url: "/writing",
    images: [
      {
        url: `/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`,
        width: 1200,
        height: 630,
        alt: "Beiträge von Lucas Kleipödszus",
      },
    ],
  },
  twitter: {
    title: "Beiträge",
    description,
    images: [`/api/og?title=${ogTitle}&subtitle=${ogSubtitle}`],
  },
  alternates: {
    canonical: "/writing",
  },
};

export default function WritingPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="relative">
      {/* Main content - centered */}
      <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
        <h1 className="text-3xl font-medium mb-6">Beiträge</h1>

        <CategoryNav categories={categories} />

        <div className="space-y-6 sm:space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          ) : (
            <p className="text-muted-foreground">
              Noch keine Beiträge. Lege MDX-Dateien in{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded-md">
                src/blog/
              </code>{" "}
              an, um loszulegen.
            </p>
          )}
        </div>
      </div>

      {/* Desktop sidebar - positioned to the right of centered content */}
      <aside>
        <CategoryNav categories={categories} desktopSidebar />
      </aside>
    </div>
  );
}
