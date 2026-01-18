# Content Authoring

This guide covers writing blog posts and other content using MDX.

## Blog Posts

Blog posts are MDX files in `src/blog/`. You can organize posts into year subfolders (e.g., `src/blog/2024/`, `src/blog/2025/`) for convenience—the folder structure is purely organizational and doesn't affect URLs.

### Frontmatter Schema

```yaml
---
title: Post Title
date: YYYY-MM-DD
excerpt: Short description
categories:
  - Category
featuredImage: /path/to/image.jpg  # optional
---
```

### Draft Posts

To create a draft post that won't be published, add `draft: true` to the frontmatter:

```yaml
---
title: Work in Progress
date: 2025-01-15
excerpt: This post is still being written
draft: true
---
```

Draft posts are excluded from the blog listing and sitemap but can still be previewed directly by URL during development.

## MDX Features

MDX allows you to use React components directly in your markdown content. See [components.md](./components.md) for available components.

### Code Blocks

Always use fenced code blocks with metadata in the info string. This preserves indentation correctly:

```mdx
\`\`\`json filename="package.json"
{
  "name": "my-app",
  "scripts": {
    "dev": "next dev"
  }
}
\`\`\`
```

Available options in the info string:
- `filename="name.ext"` - Shows filename header
- `maxLines={8}` - Collapsible with expand button
- `showLineNumbers={false}` - Hides line numbers

**Important:** Do NOT use `<CodeBlock>` as a JSX component directly in MDX—the MDX compiler strips indentation from JSX expressions.
