export const metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-medium mb-8">About</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          I&apos;m Nick Diego—a Product Marketing Manager at Automattic, WordPress
          Core contributor, and hobby web developer.
        </p>

        <p>
          This site is dedicated to my current WordPress projects and
          explorations into related technologies. Feel free to have a look
          around and reach out if you&apos;d like to connect.
        </p>

        <h2>What I do</h2>

        <p>
          At Automattic, I work on developer tools and help communicate the
          value of WordPress to developers around the world. I&apos;m also an active
          contributor to WordPress Core, focusing on the block editor and
          related developer experience improvements.
        </p>

        <h2>Projects</h2>

        <p>
          I maintain several open-source WordPress plugins, including Block
          Visibility and the Icon Block, both of which have reached 30,000+
          active users.
        </p>
      </div>
    </div>
  );
}
