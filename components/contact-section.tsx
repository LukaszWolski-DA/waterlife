"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ContactInfo } from "@/types/homepage";
import type { ContactFormData } from "@/types/contact";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface ContactSectionProps {
  content: ContactInfo;
}

export function ContactSection({ content }: ContactSectionProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showAttachment, setShowAttachment] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  if (!content) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
    if (!allowed.some(ext => selected.name.toLowerCase().endsWith(ext))) {
      toast({ title: 'Nieobsługiwany format pliku', description: 'Dozwolone: JPG, PNG, PDF, DOCX', variant: 'destructive' });
      e.target.value = '';
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast({ title: 'Plik za duży', description: 'Maksymalny rozmiar to 10 MB', variant: 'destructive' });
      e.target.value = '';
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: 'Błąd',
        description: 'Wypełnij wszystkie wymagane pola',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      if (formData.phone) fd.append('phone', formData.phone);
      if (formData.subject) fd.append('subject', formData.subject);
      fd.append('message', formData.message);
      if (file) fd.append('attachment', file);

      const response = await fetch('/api/kontakt', {
        method: 'POST',
        body: fd,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Wiadomość wysłana!',
          description: 'Odpowiemy tak szybko, jak to możliwe.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFile(null);
        setShowAttachment(false);
      } else {
        throw new Error(result.error || 'Nie udało się wysłać wiadomości');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
      wide: true,
    },
    {
      icon: Clock,
      title: "Godziny pracy",
      value: content.workingHours,
      href: "#",
    },
    {
      icon: FacebookIcon,
      title: "Facebook",
      value: "Waterlife na Facebooku",
      href: "https://www.facebook.com/people/WaterLife-Technika-Grzewcza-i-Systemy-Nawadniaj%C4%85ce/61572070976050/#",
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
                  className={`border-border hover:border-primary/50 transition-colors${info.wide ? " sm:col-span-2" : ""}`}
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
                        target={info.title === "Adres" || info.title === "Facebook" ? "_blank" : undefined}
                        rel={info.title === "Adres" || info.title === "Facebook" ? "noopener noreferrer" : undefined}
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Imię i nazwisko <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      placeholder="Jan Kowalski"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Telefon
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48 123 456 789"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Temat
                  </label>
                  <Input
                    id="subject"
                    placeholder="Temat wiadomości"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground"
                    >
                      Wiadomość <span className="text-destructive">*</span>
                    </label>
                    {!showAttachment && (
                      <button
                        type="button"
                        onClick={() => setShowAttachment(true)}
                        className="text-sm text-primary flex items-center gap-1 hover:underline"
                      >
                        <Paperclip className="w-4 h-4" />
                        Dodaj załącznik
                      </button>
                    )}
                  </div>
                  <Textarea
                    id="message"
                    placeholder="Opisz swoje potrzeby..."
                    rows={10}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>
                {showAttachment && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="attachment"
                        className="block text-sm font-medium text-foreground"
                      >
                        Załącznik (opcjonalnie)
                      </label>
                      <button
                        type="button"
                        onClick={() => { setShowAttachment(false); setFile(null); }}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Usuń
                      </button>
                    </div>
                    <input
                      id="attachment"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.docx"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="sr-only"
                    />
                    <label
                      htmlFor="attachment"
                      className={`text-sm text-primary flex items-center gap-1 hover:underline cursor-pointer w-fit${loading ? ' pointer-events-none opacity-50' : ''}`}
                    >
                      <Paperclip className="w-4 h-4" />
                      {file ? file.name : 'Wybierz plik'}
                    </label>
                    {file && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, PDF, DOCX (max 10 MB)
                    </p>
                  </div>
                )}
                <Button className="w-full" size="lg" type="submit" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Wysyłanie...' : content.formButtonText}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Wysyłając formularz, akceptujesz naszą{" "}
                  <a href="/polityka-prywatnosci" className="underline hover:text-foreground transition-colors">
                    Politykę prywatności
                  </a>
                  .
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
