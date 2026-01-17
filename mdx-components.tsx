import React, { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Link } from '@/components/ui/link';
import { Notice } from '@/components/Notice';
import { GitHubStats } from '@/components/GitHubStats';
import { YouTube } from '@/components/YouTube';
import { Tweet } from '@/components/Tweet';
import { Image } from '@/components/Image';
import { CodeBlock } from '@/components/CodeBlock';

type AnchorProps = ComponentPropsWithoutRef<'a'>;

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }: AnchorProps) => {
      const className =
        'text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 font-normal no-underline transition-colors';
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className={className} {...props}>
            {children}
          </Link>
        );
      }
      if (href?.startsWith('#')) {
        return (
          <a href={href} className={className} {...props}>
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...props}
        >
          {children}
        </a>
      );
    },
    // Override default code blocks with syntax highlighting
    // rehype-mdx-code-props passes meta string props directly to pre element
    pre: ({
      children,
      filename,
      maxLines,
      showLineNumbers: showLineNumbersProp,
    }: {
      children: React.ReactNode;
      filename?: string;
      maxLines?: number;
      showLineNumbers?: boolean;
    }) => {
      // Extract code element props
      const codeElement = children as React.ReactElement<{
        className?: string;
        children?: string;
      }>;

      if (!codeElement?.props) {
        return <pre>{children}</pre>;
      }

      const { className, children: code } = codeElement.props;

      const language = className?.replace('language-', '') || 'plaintext';
      const showLineNumbers = showLineNumbersProp !== false;

      if (typeof code !== 'string') {
        return <pre>{children}</pre>;
      }

      return (
        <CodeBlock
          language={language}
          showLineNumbers={showLineNumbers}
          filename={filename}
          maxLines={maxLines}
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
