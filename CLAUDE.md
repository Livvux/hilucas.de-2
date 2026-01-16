# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/claude-code) when working with this codebase.

## Project Overview

Personal website for Nick Diego built with Next.js 16, MDX for content, and Tailwind CSS v4. Migrating from WordPress to a modern static site architecture.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Content**: MDX with next-mdx-remote
- **Styling**: Tailwind CSS v4 with shadcn/ui color system
- **Syntax Highlighting**: Shiki (GitHub light/dark themes)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## Key Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── CodeBlock.tsx   # Server component for syntax highlighting
│   └── CodeBlockClient.tsx  # Client component for interactivity
├── content/
│   └── posts/          # MDX blog posts
├── lib/
│   ├── posts.ts        # Post fetching utilities
│   ├── shiki.ts        # Syntax highlighter setup
│   ├── site.ts         # Site configuration
│   ├── metadata.ts     # SEO utilities
│   └── utils.ts        # shadcn/ui cn() utility
└── mdx-components.tsx  # Custom MDX components
```

## Content

Blog posts are MDX files in `src/content/posts/`. Frontmatter schema:

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

## Styling

- Uses shadcn/ui semantic color variables (bg-muted, text-foreground, border-border, etc.)
- Dark mode configured via Tailwind v4: `@custom-variant dark (&:where(.dark, .dark *))`
- CSS variables defined in `src/app/globals.css`

## Custom Components Available in MDX

- `<CodeBlock>` - Syntax highlighted code with line numbers, copy button, collapsible
- `<YouTube id="..." />` - YouTube embeds
- `<Image src="..." alt="..." />` - Optimized images with captions
- `<GitHubStats repo="owner/repo" />` - GitHub repo stats
