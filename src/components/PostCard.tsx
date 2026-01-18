'use client';

import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { getCategorySlug } from '@/lib/categories';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function PostCard({ post }: { post: PostMeta }) {
  const date = dateFormatter.format(new Date(post.date));

  return (
    <Link href={`/${post.slug}`} className="block">
      <article className="rounded-md border border-border p-6 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {post.categories.map((cat, i) => (
              <span key={cat}>
                <Link
                  href={`/writing/category/${getCategorySlug(cat)}`}
                  className="hover:text-foreground transition-colors"
                >
                  {cat}
                </Link>
                {i < post.categories.length - 1 && (
                  <span className="mx-1">·</span>
                )}
              </span>
            ))}
          </div>
          <time dateTime={post.date}>{date}</time>
        </div>

        <h2 className="text-xl font-medium mb-3">
          {post.title}
        </h2>

        <p className="text-sm text-copy leading-relaxed">
          {post.excerpt}
        </p>
      </article>
    </Link>
  );
}
