"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";
import { getHomepageContent, initializeHomepageStore } from "@/lib/homepage-store";
import type { HeroContent } from "@/types/homepage";

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId);

  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Icon mapping for benefits
const benefitIcons = [Truck, ShieldCheck, Headphones];

export function HeroSection() {
  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    initializeHomepageStore();
    const data = getHomepageContent();
    setContent(data.hero);
  }, []);

  if (!content) {
    return null; // Loading state
  }

  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-heating.jpg"
          alt="Nowoczesne ogrzewanie domu"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/60" />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            {content.companyName}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight text-balance">
            {content.mainTitle}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-xl">
            {content.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="group" asChild>
              <Link href="/produkty">
                {content.ctaButtonPrimary}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              asChild
            >
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>
                {content.ctaButtonSecondary}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="relative border-t border-primary-foreground/10 bg-foreground/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index] || Truck;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="bg-primary/20 rounded-full p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground">
                      {benefit.title}
                    </p>
                    <p className="text-sm text-primary-foreground/60">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
