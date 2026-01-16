import type { MDXComponents } from 'mdx/types';
import NextImage from 'next/image';
import Link from 'next/link';
import { Notice } from '@/components/Notice';
import { GitHubStats } from '@/components/GitHubStats';
import { YouTube } from '@/components/YouTube';
import { Tweet } from '@/components/Tweet';
import { Image } from '@/components/Image';
import { CodeBlock } from '@/components/CodeBlock';

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href ?? ''}
          className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          {children}
        </Link>
      );
    },
    img: ({ src, alt }) => (
      <NextImage
        src={src ?? ''}
        alt={alt ?? ''}
        width={800}
        height={450}
        className="rounded-lg my-6"
        sizes="(max-width: 768px) 100vw, 800px"
      />
    ),
    // Override default code blocks with syntax highlighting
    pre: ({ children }) => {
      // Extract code element props
      const codeElement = children as React.ReactElement<{
        className?: string;
        children?: string;
        'data-line-numbers'?: string;
        'data-filename'?: string;
      }>;

      if (!codeElement?.props) {
        return <pre>{children}</pre>;
      }

      const {
        className,
        children: code,
        'data-line-numbers': lineNumbers,
        'data-filename': filename,
      } = codeElement.props;

      const language = className?.replace('language-', '') || 'plaintext';
      const showLineNumbers = lineNumbers !== 'false';

      if (typeof code !== 'string') {
        return <pre>{children}</pre>;
      }

      return (
        <CodeBlock
          language={language}
          showLineNumbers={showLineNumbers}
          filename={filename}
        >
          {code}
        </CodeBlock>
      );
    },
    // Custom MDX components
    Notice,
    GitHubStats,
    YouTube,
    Tweet,
    Image,
    CodeBlock,
    ...components,
  };
}
