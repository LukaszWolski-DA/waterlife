"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Droplets, Leaf } from "lucide-react";
import { getHomepageContent, initializeHomepageStore } from "@/lib/homepage-store";
import type { CategoryIntro, CategoryCard } from "@/types/homepage";

// Icon mapping for categories
const categoryIcons = [Flame, Droplets, Leaf];

// ID mapping for anchor links (matches header navigation)
const categoryIds = ['heating', 'sanitary', 'irrigation'];

export function CategoriesSection() {
  const [intro, setIntro] = useState<CategoryIntro | null>(null);
  const [cards, setCards] = useState<CategoryCard[]>([]);

  useEffect(() => {
    initializeHomepageStore();
    const data = getHomepageContent();
    setIntro(data.categoriesIntro);
    setCards(data.categoryCards);
  }, []);

  if (!intro || cards.length === 0) {
    return null;
  }
  return (
    <>
      {/* Intro section */}
      <section className="py-20 md:py-28 bg-background" id="categories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
              {intro.sectionLabel}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              {intro.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Individual category sections */}
      {cards.map((card, index) => {
        const Icon = categoryIcons[index] || Flame;
        return (
          <section
            key={card.title}
            id={categoryIds[index]}
            className={`py-20 md:py-28 ${
              index % 2 === 0 ? "bg-background" : "bg-secondary/30"
            }`}
          >
            <div className="container mx-auto px-4">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}>
                {/* Image side */}
                <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={card.image || "/placeholder.svg"}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                      <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur rounded-full p-4">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">
                    {card.productCount}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                  >
                    Zobacz produkty
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
