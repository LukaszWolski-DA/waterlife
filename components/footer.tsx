import Link from "next/link";
import { Droplets } from "lucide-react";

const footerLinks = {
  produkty: [
    { name: "Kotły gazowe", href: "#" },
    { name: "Podgrzewacze wody", href: "#" },
    { name: "Nagrzewnice", href: "#" },
    { name: "Elektrozawory", href: "#" },
  ],
  firma: [
    { name: "O nas", href: "#" },
    { name: "Kontakt", href: "#contact" },
    { name: "Regulamin", href: "#" },
    { name: "Polityka prywatności", href: "#" },
  ],
  pomoc: [
    { name: "FAQ", href: "#" },
    { name: "Dostawa", href: "#" },
    { name: "Zwroty", href: "#" },
    { name: "Gwarancja", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <Droplets className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Waterlife</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4">
              Profesjonalne rozwiązania dla techniki grzewczej, sanitarnej i
              systemów nawadniających.
            </p>
            <p className="text-primary-foreground/60 text-sm">
              Waterlife s.c.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Produkty</h4>
            <ul className="space-y-2">
              {footerLinks.produkty.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Firma</h4>
            <ul className="space-y-2">
              {footerLinks.firma.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Pomoc</h4>
            <ul className="space-y-2">
              {footerLinks.pomoc.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Waterlife s.c. Wszystkie prawa
            zastrzeżone.
          </p>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
            <span>biuro@waterlife.net.pl</span>
            <span>•</span>
            <span>tel. 535-430-854</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
