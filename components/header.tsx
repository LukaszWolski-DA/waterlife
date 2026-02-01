"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Droplets,
  Menu,
  Phone,
  Mail,
  ShoppingCart,
} from "lucide-react";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";
import { UserDropdown } from "@/components/UserDropdown";
import { useCart } from "@/hooks/useCart";

const navigation = [
  { name: "Technika Grzewcza", href: "#heating" },
  { name: "Systemy Sanitarne", href: "#sanitary" },
  { name: "Nawadnianie", href: "#irrigation" },
  { name: "Produkty", href: "#products" },
  { name: "Kontakt", href: "#contact" },
];

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);

  if (element) {
    const headerOffset = 80; // Wysokość sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      {/* Top bar */}
      <div className="hidden md:block bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a
              href="mailto:biuro@waterlife.net.pl"
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              biuro@waterlife.net.pl
            </a>
            <a
              href="tel:+48535430854"
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              535-430-854
            </a>
          </div>
          <p className="text-primary-foreground/70">
            Profesjonalne rozwiązania dla Twojego domu
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">
                Waterlife
              </span>
              <span className="hidden sm:block text-xs text-muted-foreground">
                Technika grzewcza i sanitarna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isSectionLink = item.href.startsWith('#');
              const isDisabled = isSectionLink && !isHomePage;

              return (
                <a
                  key={item.name}
                  href={isDisabled ? undefined : item.href}
                  onClick={isDisabled ? undefined : (e) => handleSmoothScroll(e, item.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDisabled
                      ? 'text-foreground/30 cursor-default'
                      : 'text-foreground/80 hover:text-foreground hover:bg-secondary cursor-pointer'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Ukryj wyszukiwarke na stronie /produkty - ma dedykowana */}
            {pathname !== '/produkty' && (
              <HeaderSearchBar className="hidden md:block w-[200px] lg:w-[280px]" />
            )}

            <UserDropdown className="hidden md:flex" />

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/koszyk">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
                <span className="sr-only">Koszyk</span>
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Ukryj wyszukiwarke na stronie /produkty - ma dedykowana */}
                  {pathname !== '/produkty' && (
                    <HeaderSearchBar onSearch={() => setIsOpen(false)} />
                  )}
                  <nav className="flex flex-col gap-2">
                    {navigation.map((item) => {
                      const isSectionLink = item.href.startsWith('#');
                      const isDisabled = isSectionLink && !isHomePage;

                      return (
                        <a
                          key={item.name}
                          href={isDisabled ? undefined : item.href}
                          onClick={
                            isDisabled
                              ? undefined
                              : (e) => {
                                  handleSmoothScroll(e, item.href);
                                  setIsOpen(false);
                                }
                          }
                          className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                            isDisabled
                              ? 'text-foreground/30 cursor-default'
                              : 'text-foreground hover:bg-secondary cursor-pointer'
                          }`}
                        >
                          {item.name}
                          {isDisabled && (
                            <span className="block text-xs text-muted-foreground mt-1">
                              Tylko na stronie głównej
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </nav>
                  {/* User section */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-2">Twoje konto</p>
                    <UserDropdown />
                  </div>

                  {/* Contact section */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <a
                        href="mailto:biuro@waterlife.net.pl"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        biuro@waterlife.net.pl
                      </a>
                      <a
                        href="tel:+48535430854"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        535-430-854
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
