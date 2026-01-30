import { Link } from "@/components/ui/link";
import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="mt-8 md:mt-16">
      <div className="max-w-2xl mx-auto px-6 py-6 md:py-12">
        <div className="flex justify-between items-start gap-8 mb-12">
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-medium mb-4">Entdecken</h3>
              <ul className="text-sm">
                <li>
                  <Link href="/about" variant="muted" className="block py-1">
                    Über mich
                  </Link>
                </li>
                <li>
                  <Link href="/writing" variant="muted" className="block py-1">
                    Beiträge
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Kontakt</h3>
              <ul className="text-sm">
                <li>
                  <Link
                    href="https://x.com/Livvux"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="muted"
                    className="block py-1"
                  >
                    X
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/Livvux"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="muted"
                    className="block py-1"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/lucas-kleipoedszus/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="muted"
                    className="block py-1"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:mail@hilucas.de"
                    variant="muted"
                    className="block py-1"
                  >
                    E-Mail
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="pt-8 border-t border-border text-xs text-muted-foreground">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Lucas Kleipödszus. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
