"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

interface HeaderProps {
  phone?: string;
  phoneLink?: string;
  email?: string;
  emailLink?: string;
}

export function Header({
  phone = '535-430-854',
  phoneLink = 'tel:+48535430854',
  email = 'biuro@waterlife.net.pl',
  emailLink = 'mailto:biuro@waterlife.net.pl',
}: HeaderProps) {
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
              href={emailLink}
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {email}
            </a>
            <a
              href={phoneLink}
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <a
              href="https://www.facebook.com/people/Waterlife-Technika-Grzewcza-i-Systemy-Nawadniaj%C4%85ce/61588447900070/?mibextid=wwXIfr&rdid=0i1vzqeFoIih667q&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G4U7QH6WD%2F%3Fmibextid%3DwwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </a>
          </div>
          <p className="text-primary-foreground/70">
            Profesjonalne rozwiązania instalacyjne oraz nawodnieniowe
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
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {/* Ukryj wyszukiwarke na stronie /produkty - ma dedykowana */}
                  {pathname !== '/produkty' && (
                    <HeaderSearchBar onSearch={() => setIsOpen(false)} />
                  )}
                  {/* Navigation - tylko na stronie głównej */}
                  {isHomePage && (
                    <nav className="flex flex-col gap-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => {
                            handleSmoothScroll(e, item.href);
                            setIsOpen(false);
                          }}
                          className="px-4 py-3 text-sm font-medium rounded-md transition-colors text-foreground hover:bg-secondary cursor-pointer"
                        >
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  )}
                  {/* User section */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-2">Twoje konto</p>
                    <UserDropdown />
                  </div>

                  {/* Contact section */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <a
                        href={emailLink}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {email}
                      </a>
                      <a
                        href={phoneLink}
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {phone}
                      </a>
                      <a
                        href="https://www.facebook.com/people/Waterlife-Technika-Grzewcza-i-Systemy-Nawadniaj%C4%85ce/61588447900070/?mibextid=wwXIfr&rdid=0i1vzqeFoIih667q&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G4U7QH6WD%2F%3Fmibextid%3DwwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        aria-label="Facebook"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                        Facebook
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
