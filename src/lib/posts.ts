import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  readingTime: string;
  featuredImage?: string;
}

export function getAllPosts(): PostMeta[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title ?? 'Untitled',
        date: data.date ?? new Date().toISOString(),
        excerpt: data.excerpt ?? '',
        categories: data.categories ?? [],
        readingTime: stats.text,
        featuredImage: data.featuredImage,
      };
    })
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const stats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title ?? 'Untitled',
      date: data.date ?? new Date().toISOString(),
      excerpt: data.excerpt ?? '',
      categories: data.categories ?? [],
      readingTime: stats.text,
      featuredImage: data.featuredImage,
    },
    content,
  };
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  posts.forEach((post) => post.categories.forEach((cat) => categories.add(cat)));
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
  );
}
