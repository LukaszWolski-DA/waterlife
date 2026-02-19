"use client";

import type { BrandsContent } from "@/types/homepage";

interface BrandsSectionProps {
  content: BrandsContent;
}

export function BrandsSection({ content }: BrandsSectionProps) {
  if (!content) {
    return null;
  }

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wide">
          {content.sectionLabel}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {content.brands.map((brand, index) => {
            const brandElement = (
              <div className="text-xl md:text-2xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer">
                {brand.name}
              </div>
            );

            if (brand.url) {
              // Ensure URL has protocol (http:// or https://)
              const fullUrl = brand.url.match(/^https?:\/\//)
                ? brand.url
                : `https://${brand.url}`;

              return (
                <a
                  key={index}
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  {brandElement}
                </a>
              );
            }

            return <div key={index}>{brandElement}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
