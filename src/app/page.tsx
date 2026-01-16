import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-medium mb-4">Hi there</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I&apos;m Nick—a Product Marketing Manager at Automattic, WordPress Core
            contributor, and hobby web developer. This site&apos;s dedicated to my
            current WordPress projects and explorations into related technologies.
            Have a look around.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            {/* Replace with your hero image */}
            <span className="text-sm">Hero Image</span>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <h2 className="text-2xl font-medium mb-4">Posts</h2>
        <p className="text-muted-foreground mb-8">
          Everything from WordPress tutorials and AI experiments to web
          development resources and personal updates.
        </p>

        {posts.length > 0 ? (
          <div className="space-y-12 mb-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">
            No posts yet. Add MDX files to{' '}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
              src/content/posts/
            </code>{' '}
            to get started.
          </p>
        )}

        <Link
          href="/posts"
          className="text-sm font-medium hover:text-muted-foreground transition-colors"
        >
          View all →
        </Link>
      </section>
    </div>
  );
}
