import type { Metadata } from "next";
import { WPPluginStat } from "@/components/WPPluginStat";
import { Separator } from "@/components/ui/separator";

const description =
  "Open-source WordPress plugins and tools including Block Visibility, Icon Block, and more.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  openGraph: {
    title: "Projects",
    description,
    url: "/projects",
    images: [
      {
        url: "/api/og?title=Projects&subtitle=Open-source WordPress plugins and tools",
        width: 1200,
        height: 630,
        alt: "Projects by Nick Diego",
      },
    ],
  },
  twitter: {
    title: "Projects",
    description,
    images: ["/api/og?title=Projects&subtitle=Open-source WordPress plugins and tools"],
  },
  alternates: {
    canonical: "/projects",
  },
};

const projects = [
  {
    name: "Block Visibility",
    description:
      "Control when and where blocks are displayed on your WordPress site. 30,000+ active users.",
    url: "https://github.com/ndiego/block-visibility",
  },
  {
    name: "Icon Block",
    description:
      "A simple yet powerful block for adding custom SVG icons to your WordPress site. 30,000+ active users.",
    url: "https://github.com/ndiego/icon-block",
  },
  {
    name: "Enable Linked Groups",
    description:
      "Make Group blocks clickable while maintaining internal link functionality.",
    url: "https://github.com/ndiego/enable-linked-groups",
  },
  {
    name: "Enable Button Icons",
    description: "Add icons to Button blocks in WordPress.",
    url: "https://github.com/ndiego/enable-button-icons",
  },
  {
    name: "Social Sharing Block",
    description: "A simple social sharing block for WordPress.",
    url: "https://github.com/ndiego/social-sharing-block",
  },
];

const pluginSlugs = [
  "block-visibility",
  "icon-block",
  "social-sharing-block",
  "genesis-featured-page-advanced",
  "genesis-columns-advanced",
];

export default function ProjectsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
      <h1 className="text-3xl font-medium mb-8">Projects</h1>

      <p className="text-copy mb-12">
        A collection of open-source WordPress plugins and tools I&apos;ve built
        and maintain.
      </p>

      <section className="mb-12">
        <h3 className="text-lg font-medium mb-6">WordPress.org stats</h3>
        <div className="space-y-2">
          <WPPluginStat slugs={pluginSlugs} stat="plugins" />
          <Separator />
          <WPPluginStat slugs={pluginSlugs} stat="active_installs" />
          <Separator />
          <WPPluginStat slugs={pluginSlugs} stat="downloads" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-6">All Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 border border-border rounded-md hover:border-muted-foreground/50 transition-colors"
            >
              <h3 className="font-medium mb-2">{project.name}</h3>
              <p className="text-sm text-copy">{project.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
