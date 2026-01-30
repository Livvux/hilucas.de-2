"use client";

import { useState } from "react";
import { Link } from "@/components/ui/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="py-6 md:py-10 mb-2 md:mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-6">
        <Link
          href="/"
          className="flex items-center gap-4 hover:opacity-70 transition-opacity"
          variant="unstyled"
        >
          <Image
            src="/images/avatar.jpg"
            alt="Lucas Kleipödszus"
            width={48}
            height={48}
            className="rounded-full sm:hidden"
          />
          <span className="font-medium hidden sm:block">Lucas Kleipödszus</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden sm:flex items-center gap-5">
          <Link href="/about" variant="muted" className="text-sm">
            Über mich
          </Link>
          <Link href="/writing" variant="muted" className="text-sm">
            Beiträge
          </Link>
        </nav>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            }
          />
          <SheetContent side="right">
            <SheetTitle className="text-base font-medium">
              <Link href="/" onClick={() => setOpen(false)} variant="unstyled">
                Lucas Kleipödszus
              </Link>
            </SheetTitle>
            <nav className="flex flex-col gap-2 mt-8">
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                variant="muted"
              >
                Über mich
              </Link>
              <Link
                href="/writing"
                onClick={() => setOpen(false)}
                variant="muted"
              >
                Beiträge
              </Link>
            </nav>

            <div className="flex flex-col gap-2 mt-8 pt-8 border-t border-border">
              <Link
                href="https://x.com/Livvux"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                variant="muted"
              >
                X
              </Link>
              <Link
                href="https://github.com/Livvux"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                variant="muted"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/lucas-kleipoedszus/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                variant="muted"
              >
                LinkedIn
              </Link>
              <Link
                href="mailto:mail@hilucas.de"
                onClick={() => setOpen(false)}
                variant="muted"
              >
                E-Mail
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
