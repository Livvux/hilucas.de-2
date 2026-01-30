import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/ui/link";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import {
  getCategoryFromSlug,
  getCategorySlug,
  categoryMeta,
} from "@/lib/categories";
import { PostCard } from "@/components/post-card";
import { siteConfig } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: getCategorySlug(cat) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = getCategoryFromSlug(slug, categories);

  if (!category) return {};

  const description =
    categoryMeta[category]?.description ?? `Beiträge über ${category}`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(category)}&subtitle=${encodeURIComponent("Beiträge in dieser Kategorie")}`;

  return {
    title: category,
    description,
    openGraph: {
      title: category,
      description,
      url: `/writing/category/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        alt: `Beiträge zu ${category}`,
        },
      ],
    },
    twitter: {
      title: category,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteConfig.url}/writing/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = getCategoryFromSlug(slug, categories);

  if (!category) notFound();

  const posts = getPostsByCategory(category);
  const description = categoryMeta[category]?.description;

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-medium">{category}</h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
        <Link href="/writing" variant="muted" className="text-sm">
          ← Alle Beiträge
        </Link>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-muted-foreground">
            Noch keine Beiträge in dieser Kategorie.
          </p>
        )}
      </div>
    </div>
  );
}
