import Link from 'next/link';

const explore = [
  { href: '/about', label: 'About' },
  { href: '/posts', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/speaking', label: 'Talks' },
];

const social = [
  { href: 'https://x.com/nickmdiego', label: 'X' },
  { href: 'https://bsky.app/profile/nickdiego.com', label: 'Bluesky' },
  { href: 'https://linkedin.com/in/nickmdiego', label: 'LinkedIn' },
  { href: 'https://profiles.wordpress.org/ndiego', label: 'WordPress' },
  { href: 'https://github.com/ndiego', label: 'GitHub' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-wide mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Connect</h3>
            <ul className="space-y-2">
              {social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-sm text-muted-foreground">
          <p>© {currentYear} Nick Diego. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
