import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/posts', label: 'Posts' },
  { href: '/projects', label: 'Projects' },
  { href: '/speaking', label: 'Talks' },
];

export function Header() {
  return (
    <header className="py-8">
      <div className="flex items-center justify-between max-w-wide mx-auto px-6">
        <Link
          href="/"
          className="flex items-center gap-4 hover:opacity-70 transition-opacity"
        >
          <Image
            src="/avatar.jpg"
            alt="Nick Diego"
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="font-medium">Nick Diego</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
      <hr className="mt-8 border-border" />
    </header>
  );
}
