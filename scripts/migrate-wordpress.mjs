#!/usr/bin/env node

/**
 * WordPress to MDX Migration Script
 *
 * Parses WordPress XML export and converts published posts to MDX format.
 * Downloads images and stores them locally.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const CONTENT_DIR = join(PROJECT_ROOT, 'src/content/posts');
const IMAGES_DIR = join(PROJECT_ROOT, 'public/images/posts');

// Simple XML parsing without external dependencies
function parseXML(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const getTag = (tag) => {
      const regex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([^<]*)</${tag}>`);
      const m = itemContent.match(regex);
      return m ? (m[1] || m[2] || '').trim() : '';
    };

    const getWpTag = (tag) => {
      const regex = new RegExp(`<wp:${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></wp:${tag}>|<wp:${tag}>([^<]*)</wp:${tag}>`);
      const m = itemContent.match(regex);
      return m ? (m[1] || m[2] || '').trim() : '';
    };

    // Get categories
    const categories = [];
    const catRegex = /<category domain="category"[^>]*><!\[CDATA\[([^\]]+)\]\]><\/category>/g;
    let catMatch;
    while ((catMatch = catRegex.exec(itemContent)) !== null) {
      if (catMatch[1] !== 'Uncategorized') {
        categories.push(catMatch[1]);
      }
    }

    // Get featured image ID
    const thumbnailMatch = itemContent.match(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/);
    const thumbnailId = thumbnailMatch ? thumbnailMatch[1] : null;

    items.push({
      title: getTag('title'),
      content: getTag('content:encoded'),
      excerpt: getTag('excerpt:encoded'),
      date: getWpTag('post_date'),
      slug: getWpTag('post_name'),
      status: getWpTag('status'),
      postType: getWpTag('post_type'),
      postId: getWpTag('post_id'),
      categories,
      thumbnailId,
    });
  }

  return items;
}

// Download image from URL
async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      protocol.get(currentUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          request(response.headers.location, redirectCount + 1);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          mkdirSync(dirname(destPath), { recursive: true });
          writeFileSync(destPath, buffer);
          resolve(destPath);
        });
        response.on('error', reject);
      }).on('error', reject);
    };

    request(url);
  });
}

// Extract image URLs from WordPress content
function extractImageUrls(content) {
  const urls = new Set();

  // Match img src attributes
  const imgRegex = /src="(https?:\/\/[^"]+\.(jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    urls.add(match[1].split('?')[0]); // Remove query params
  }

  return Array.from(urls);
}

// Convert WordPress block HTML to MDX
function convertToMDX(content, slug) {
  if (!content) return '';

  let mdx = content;

  // First, handle YouTube embeds (before removing block comments)
  // Match wp:embed blocks with YouTube URLs
  mdx = mdx.replace(/<!-- wp:embed\s*(\{[^}]*"providerNameSlug"\s*:\s*"youtube"[^}]*\})\s*-->\s*<figure[^>]*>[\s\S]*?<div[^>]*>\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^\s<]*)\s*<\/div>[\s\S]*?<\/figure>\s*<!-- \/wp:embed -->/gi,
    (match, attrs, url, videoId) => `\n<YouTube id="${videoId}" />\n`
  );

  // Also match wp:core-embed/youtube blocks
  mdx = mdx.replace(/<!-- wp:core-embed\/youtube[^>]*-->\s*<figure[^>]*>[\s\S]*?(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^\s<]*)[\s\S]*?<\/figure>\s*<!-- \/wp:core-embed\/youtube -->/gi,
    (match, url, videoId) => `\n<YouTube id="${videoId}" />\n`
  );

  // Handle code blocks with language from wp:code comment
  mdx = mdx.replace(/<!-- wp:code\s*(\{[^}]*\})?\s*-->\s*<pre[^>]*><code([^>]*)>([\s\S]*?)<\/code><\/pre>\s*<!-- \/wp:code -->/gi,
    (match, wpAttrs, codeAttrs, code) => {
      let lang = 'javascript'; // Default to JavaScript

      // Try to get language from code tag attributes
      const langMatch = codeAttrs.match(/lang="([^"]+)"/);
      if (langMatch) lang = langMatch[1];

      const classMatch = codeAttrs.match(/class="language-([^"]+)"/);
      if (classMatch) lang = classMatch[1];

      // Map common languages
      if (lang === 'jscript' || lang === 'js') lang = 'javascript';
      if (lang === 'markup' || lang === 'html') lang = 'html';

      code = decodeHTMLEntities(code.trim());
      return '\n```' + lang + '\n' + code + '\n```\n';
    }
  );

  // Handle syntax highlighter code blocks with language from comment
  mdx = mdx.replace(/<!-- wp:syntaxhighlighter\/code\s*(\{[^}]*\})?\s*-->\s*<pre[^>]*>([\s\S]*?)<\/pre>\s*<!-- \/wp:syntaxhighlighter\/code -->/gi,
    (match, wpAttrs, code) => {
      let lang = 'bash';

      // Try to extract language from wpAttrs JSON
      if (wpAttrs) {
        const langMatch = wpAttrs.match(/"language"\s*:\s*"([^"]+)"/);
        if (langMatch) lang = langMatch[1];
      }

      // Map common languages
      if (lang === 'jscript' || lang === 'js') lang = 'javascript';
      if (lang === 'markup') lang = 'html';

      code = decodeHTMLEntities(code.trim());
      return '\n```' + lang + '\n' + code + '\n```\n';
    }
  );

  // Now remove remaining WordPress block comments
  mdx = mdx.replace(/<!-- wp:[^\s]+[^>]*-->/g, '');
  mdx = mdx.replace(/<!-- \/wp:[^\s]+ -->/g, '');

  // Convert any remaining code blocks
  mdx = mdx.replace(/<pre class="wp-block-code"><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi, (match, attrs, code) => {
    let lang = 'javascript';
    const langMatch = attrs.match(/lang="([^"]+)"/);
    if (langMatch) lang = langMatch[1];
    const classMatch = attrs.match(/class="language-([^"]+)"/);
    if (classMatch) lang = classMatch[1];
    code = decodeHTMLEntities(code.trim());
    return '\n```' + lang + '\n' + code + '\n```\n';
  });

  // Convert any remaining syntax highlighter code blocks
  mdx = mdx.replace(/<pre class="wp-block-syntaxhighlighter-code">([\s\S]*?)<\/pre>/gi, (match, code) => {
    code = decodeHTMLEntities(code.trim());
    return '\n```bash\n' + code + '\n```\n';
  });

  // Convert images with captions - handle various WordPress image block formats
  mdx = mdx.replace(/<figure class="wp-block-image[^"]*"[^>]*>(?:<div[^>]*>)?[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/gi,
    (match, src, alt, caption) => {
      const localPath = convertImagePath(src, slug);
      let result = `\n<Image src="${localPath}" alt="${alt || ''}"`;
      if (caption) {
        const cleanCaption = convertInlineHTML(caption.trim());
        result += ` caption={<>${cleanCaption}</>}`;
      }
      result += ' />\n';
      return result;
    }
  );

  // Convert standalone images
  mdx = mdx.replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, (match, src, alt) => {
    const localPath = convertImagePath(src, slug);
    return `\n<Image src="${localPath}" alt="${alt || ''}" />\n`;
  });

  // Convert any remaining YouTube URLs that might be in links or text
  mdx = mdx.replace(/\[([^\]]*)\]\(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)[^)]*\)/gi,
    (match, text, videoId) => `\n<YouTube id="${videoId}" />\n`
  );

  // Convert headings
  mdx = mdx.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (match, text) => `\n## ${stripHTML(text).trim()}\n`);
  mdx = mdx.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (match, text) => `\n### ${stripHTML(text).trim()}\n`);
  mdx = mdx.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (match, text) => `\n#### ${stripHTML(text).trim()}\n`);

  // Convert paragraphs
  mdx = mdx.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, text) => {
    const converted = convertInlineHTML(text.trim());
    return converted ? `\n${converted}\n` : '';
  });

  // Convert lists
  mdx = mdx.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, list) => {
    return '\n' + list.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, item) => {
      return `- ${convertInlineHTML(item.trim())}\n`;
    });
  });

  mdx = mdx.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, list) => {
    let index = 1;
    return '\n' + list.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, item) => {
      return `${index++}. ${convertInlineHTML(item.trim())}\n`;
    });
  });

  // Convert blockquotes
  mdx = mdx.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, text) => {
    const clean = stripHTML(text).trim();
    return '\n> ' + clean.split('\n').join('\n> ') + '\n';
  });

  // Clean up divs and other containers
  mdx = mdx.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1');
  mdx = mdx.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, '$1');

  // Remove ALL remaining HTML comments (critical for MDX)
  mdx = mdx.replace(/<!--[\s\S]*?-->/g, '');

  // Remove WordPress Icon Block SVGs (they have complex inline styles)
  mdx = mdx.replace(/<(?:a|div)[^>]*class="[^"]*icon-container[^"]*"[^>]*>[\s\S]*?<\/(?:a|div)>/gi, '');

  // Remove any remaining HTML tags that might cause issues
  mdx = mdx.replace(/<\/?span[^>]*>/gi, '');
  mdx = mdx.replace(/<\/?br\s*\/?>/gi, '\n');

  // Remove any elements with style= attributes (problematic in MDX/JSX)
  mdx = mdx.replace(/<[a-z]+[^>]*style="[^"]*"[^>]*>[\s\S]*?<\/[a-z]+>/gi, '');
  mdx = mdx.replace(/<[a-z]+[^>]*style="[^"]*"[^>]*\/>/gi, '');

  // Final cleanup: convert any remaining <p> tags that span multiple lines
  mdx = mdx.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, text) => {
    const converted = convertInlineHTML(text.trim());
    return converted ? `\n${converted}\n` : '';
  });

  // Remove any unclosed <p> tags (convert to plain text)
  mdx = mdx.replace(/<p[^>]*>/gi, '\n');
  mdx = mdx.replace(/<\/p>/gi, '\n');

  // Clean up any stray HTML entities
  mdx = decodeHTMLEntities(mdx);

  // Remove empty lines and normalize spacing
  mdx = mdx.replace(/\n{3,}/g, '\n\n');
  mdx = mdx.trim();

  return mdx;
}

// Convert inline HTML (links, bold, italic, code)
function convertInlineHTML(html) {
  let result = html;

  // Convert links
  result = result.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (match, href, text) => {
    const cleanText = stripHTML(text);
    return `[${cleanText}](${href})`;
  });

  // Convert bold
  result = result.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  result = result.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');

  // Convert italic
  result = result.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  result = result.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*');

  // Convert inline code
  result = result.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`');

  // Decode HTML entities
  result = decodeHTMLEntities(result);

  return result;
}

// Strip all HTML tags
function stripHTML(html) {
  return html.replace(/<[^>]+>/g, '');
}

// Decode HTML entities
function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '\u2013')  // en dash
    .replace(/&#8212;/g, '\u2014')  // em dash
    .replace(/&#8216;/g, '\u2018')  // left single quote
    .replace(/&#8217;/g, '\u2019')  // right single quote
    .replace(/&#8220;/g, '\u201C')  // left double quote
    .replace(/&#8221;/g, '\u201D')  // right double quote
    .replace(/&#8230;/g, '\u2026'); // ellipsis
}

// Convert WordPress image URL to local path
function convertImagePath(url, slug) {
  const filename = basename(url).split('?')[0];
  return `/images/posts/${slug}/${filename}`;
}

// Generate slug from title if not provided
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Format date as YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

// Main migration function
async function migrate() {
  console.log('Starting WordPress to MDX migration...\n');

  // Read XML file
  const xmlPath = join(PROJECT_ROOT, 'nickdiego.WordPress.2026-01-16.xml');
  const xml = readFileSync(xmlPath, 'utf-8');

  // Parse XML
  const items = parseXML(xml);
  console.log(`Found ${items.length} total items in XML\n`);

  // Filter published posts
  const publishedPosts = items.filter(
    (item) => item.status === 'publish' && item.postType === 'post'
  );
  console.log(`Found ${publishedPosts.length} published posts\n`);

  // Get attachments (for featured images)
  const attachments = items.filter((item) => item.postType === 'attachment');
  const attachmentMap = new Map();
  attachments.forEach((att) => {
    // Extract URL from content or guid
    const urlMatch = att.content.match(/https?:\/\/[^\s"<]+\.(jpg|jpeg|png|gif|webp)/i);
    if (urlMatch) {
      attachmentMap.set(att.postId, urlMatch[0]);
    }
  });

  // Process each post
  for (const post of publishedPosts) {
    const slug = post.slug || generateSlug(post.title);
    console.log(`Processing: ${post.title} (${slug})`);

    // Create image directory for this post
    const postImagesDir = join(IMAGES_DIR, slug);

    // Extract and download images
    const imageUrls = extractImageUrls(post.content);

    // Add featured image if exists
    if (post.thumbnailId && attachmentMap.has(post.thumbnailId)) {
      imageUrls.push(attachmentMap.get(post.thumbnailId));
    }

    for (const url of imageUrls) {
      try {
        const filename = basename(url).split('?')[0];
        const destPath = join(postImagesDir, filename);

        if (!existsSync(destPath)) {
          console.log(`  Downloading: ${filename}`);
          await downloadImage(url, destPath);
        } else {
          console.log(`  Skipping (exists): ${filename}`);
        }
      } catch (err) {
        console.log(`  Failed to download ${url}: ${err.message}`);
      }
    }

    // Convert content to MDX
    const mdxContent = convertToMDX(post.content, slug);

    // Build frontmatter
    const frontmatter = {
      title: post.title,
      date: formatDate(post.date),
      excerpt: post.excerpt || '',
      categories: post.categories.length > 0 ? post.categories : ['WordPress'],
    };

    // Add featured image if exists
    if (post.thumbnailId && attachmentMap.has(post.thumbnailId)) {
      const featuredUrl = attachmentMap.get(post.thumbnailId);
      const filename = basename(featuredUrl).split('?')[0];
      frontmatter.featuredImage = `/images/posts/${slug}/${filename}`;
    }

    // Build MDX file content
    let mdxFile = '---\n';
    mdxFile += `title: "${frontmatter.title.replace(/"/g, '\\"')}"\n`;
    mdxFile += `date: ${frontmatter.date}\n`;
    if (frontmatter.excerpt) {
      mdxFile += `excerpt: "${frontmatter.excerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"\n`;
    }
    mdxFile += 'categories:\n';
    frontmatter.categories.forEach((cat) => {
      mdxFile += `  - ${cat}\n`;
    });
    if (frontmatter.featuredImage) {
      mdxFile += `featuredImage: ${frontmatter.featuredImage}\n`;
    }
    mdxFile += '---\n\n';
    mdxFile += mdxContent;

    // Write MDX file
    const mdxPath = join(CONTENT_DIR, `${slug}.mdx`);
    writeFileSync(mdxPath, mdxFile);
    console.log(`  Created: ${slug}.mdx\n`);
  }

  console.log('\nMigration complete!');
  console.log(`Created ${publishedPosts.length} MDX files`);
}

// Run migration
migrate().catch(console.error);
