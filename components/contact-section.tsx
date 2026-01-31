"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { getHomepageContent, initializeHomepageStore } from "@/lib/homepage-store";
import type { ContactInfo } from "@/types/homepage";

export function ContactSection() {
  const [content, setContent] = useState<ContactInfo | null>(null);

  useEffect(() => {
    initializeHomepageStore();
    const data = getHomepageContent();
    setContent(data.contact);
  }, []);

  if (!content) {
    return null; // Loading state
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      value: content.phone,
      href: content.phoneLink,
    },
    {
      icon: Mail,
      title: "Email",
      value: content.email,
      href: content.emailLink,
    },
    {
      icon: MapPin,
      title: "Adres",
      value: content.address,
      href: content.addressLink,
    },
    {
      icon: Clock,
      title: "Godziny pracy",
      value: content.workingHours,
      href: "#",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left side - Info */}
          <div>
            <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
              {content.sectionLabel}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              {content.title}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {content.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((info) => (
                <Card
                  key={info.title}
                  className="border-border hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2.5">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {info.title}
                      </p>
                      <a
                        href={info.href}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                        target={info.title === "Adres" ? "_blank" : undefined}
                        rel={info.title === "Adres" ? "noopener noreferrer" : undefined}
                      >
                        {info.value}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Google Maps */}
            <Card className="border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2472.8!2d16.9110073!3d51.2907175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470f939d078a3731%3A0x660a10ce6c9d7b65!2sWaterlife%20s.c.%20-%20Technika%20grzewcza%20i%20sanitarna%2C%20instalacje%20zewn%C4%99trzne%2C%20systemy%20nawadniaj%C4%85ce!5e0!3m2!1spl!2spl!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="Mapa Google - lokalizacja Waterlife s.c."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Form */}
          <Card className="border-border">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                {content.formTitle}
              </h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Imię i nazwisko
                    </label>
                    <Input id="name" placeholder="Jan Kowalski" />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="jan@example.com" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Telefon
                  </label>
                  <Input id="phone" type="tel" placeholder="+48 123 456 789" />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Wiadomość
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Opisz swoje potrzeby..."
                    rows={4}
                  />
                </div>
                <Button className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  {content.formButtonText}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
