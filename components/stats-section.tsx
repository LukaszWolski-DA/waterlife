"use client";

import { useEffect, useState } from "react";
import { getHomepageContent, initializeHomepageStore } from "@/lib/homepage-store";
import type { StatItem } from "@/types/homepage";

export function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    initializeHomepageStore();
    const data = getHomepageContent();
    setStats(data.stats);
  }, []);

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
