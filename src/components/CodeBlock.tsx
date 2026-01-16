import { highlightCode } from '@/lib/shiki';
import { CodeBlockClient } from './CodeBlockClient';

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
  maxLines?: number;
}

export async function CodeBlock({
  children,
  language = 'plaintext',
  showLineNumbers = true,
  filename,
  maxLines,
}: CodeBlockProps) {
  const code = children.trim();
  const { light, dark } = await highlightCode(code, language);
  const lineCount = code.split('\n').length;

  return (
    <CodeBlockClient
      code={code}
      lightHtml={light}
      darkHtml={dark}
      lineCount={lineCount}
      showLineNumbers={showLineNumbers}
      filename={filename}
      maxLines={maxLines}
    />
  );
}
