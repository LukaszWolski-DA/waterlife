'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RotateCcw } from 'lucide-react';
import { useHomepageAdmin } from '@/hooks/use-homepage-admin';
import { useToast } from '@/hooks/use-toast';
import type { HomepageFormData } from '@/types/homepage';

/**
 * Admin page - Homepage content editor
 * Edycja treści na stronie głównej
 */
export default function HomepageAdminPage() {
  const { content, loading, updateContent, resetContent } = useHomepageAdmin();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HomepageFormData | null>(null);
  const [brandsText, setBrandsText] = useState('');

  useEffect(() => {
    if (content) {
      setFormData({
        hero: content.hero,
        stats: content.stats,
        contact: content.contact,
        categoriesIntro: content.categoriesIntro,
        categoryCards: content.categoryCards,
        brands: content.brands,
      });
      // Initialize brands textarea
      setBrandsText(
        content.brands.brands
          .map(b => b.url ? `${b.name}|${b.url}` : b.name)
          .join('\n')
      );
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Parse brands from textarea before saving
    const lines = brandsText.split('\n');
    const brands = lines
      .filter(line => line.trim())
      .map(line => {
        const [name, url] = line.split('|').map(s => s.trim());
        return { name: name || '', url: url || '' };
      })
      .filter(b => b.name);

    const dataToSave = {
      ...formData,
      brands: {
        ...formData.brands,
        brands,
      },
    };

    setSaving(true);
    try {
      await updateContent(dataToSave);
      toast({
        title: 'Zapisano zmiany',
        description: 'Treść strony głównej została zaktualizowana.',
      });
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać zmian.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Czy na pewno chcesz przywrócić domyślne wartości? Wszystkie zmiany zostaną utracone.')) {
      return;
    }

    try {
      const reset = await resetContent();
      setFormData({
        hero: reset.hero,
        stats: reset.stats,
        contact: reset.contact,
        categoriesIntro: reset.categoriesIntro,
        categoryCards: reset.categoryCards,
        brands: reset.brands,
      });
      toast({
        title: 'Przywrócono domyślne wartości',
        description: 'Treść strony została zresetowana.',
      });
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się przywrócić domyślnych wartości.',
        variant: 'destructive',
      });
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Strona Główna</h1>
          <p className="text-muted-foreground mt-1">
            Edytuj treści wyświetlane na stronie głównej
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Przywróć domyślne
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
            <TabsTrigger value="contact">Kontakt</TabsTrigger>
            <TabsTrigger value="categories">Kategorie</TabsTrigger>
            <TabsTrigger value="brands">Marki</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Sekcja Hero - Główny baner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nazwa firmy (mały tekst)</Label>
                  <Input
                    id="companyName"
                    value={formData.hero.companyName}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        hero: { ...prev.hero, companyName: e.target.value }
                      } : prev)
                    }
                    placeholder="Waterlife s.c."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainTitle">Główny tytuł (H1)</Label>
                  <Input
                    id="mainTitle"
                    value={formData.hero.mainTitle}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        hero: { ...prev.hero, mainTitle: e.target.value }
                      } : prev)
                    }
                    placeholder="Profesjonalna technika grzewcza i sanitarna"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Podtytuł / Opis</Label>
                  <Textarea
                    id="subtitle"
                    value={formData.hero.subtitle}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        hero: { ...prev.hero, subtitle: e.target.value }
                      } : prev)
                    }
                    rows={3}
                    placeholder="Oferujemy kompleksowe rozwiązania..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaPrimary">Przycisk główny (tekst)</Label>
                    <Input
                      id="ctaPrimary"
                      value={formData.hero.ctaButtonPrimary}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          hero: { ...prev.hero, ctaButtonPrimary: e.target.value }
                        } : prev)
                      }
                      placeholder="Przejdź do sklepu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaSecondary">Przycisk dodatkowy (tekst)</Label>
                    <Input
                      id="ctaSecondary"
                      value={formData.hero.ctaButtonSecondary}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          hero: { ...prev.hero, ctaButtonSecondary: e.target.value }
                        } : prev)
                      }
                      placeholder="Skontaktuj się"
                    />
                  </div>
                </div>

                {/* Benefits - Trust Bar */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold">Benefity (Trust Bar) - 3 elementy</h3>
                  {formData.hero.benefits.map((benefit, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">Benefit {index + 1}</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`benefit-${index}-title`}>Tytuł</Label>
                            <Input
                              id={`benefit-${index}-title`}
                              value={benefit.title}
                              onChange={(e) => {
                                const newBenefits = [...formData.hero.benefits];
                                newBenefits[index] = { ...benefit, title: e.target.value };
                                setFormData(prev => prev ? {
                                  ...prev,
                                  hero: { ...prev.hero, benefits: newBenefits }
                                } : prev);
                              }}
                              placeholder="Szybka dostawa"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`benefit-${index}-desc`}>Opis</Label>
                            <Input
                              id={`benefit-${index}-desc`}
                              value={benefit.description}
                              onChange={(e) => {
                                const newBenefits = [...formData.hero.benefits];
                                newBenefits[index] = { ...benefit, description: e.target.value };
                                setFormData(prev => prev ? {
                                  ...prev,
                                  hero: { ...prev.hero, benefits: newBenefits }
                                } : prev);
                              }}
                              placeholder="Na terenie całej Polski"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Section */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statystyki - 4 elementy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.stats.map((stat, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`stat-${index}-value`}>
                            Wartość (np. "420+", "15+", "98%")
                          </Label>
                          <Input
                            id={`stat-${index}-value`}
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...formData.stats];
                              newStats[index] = { ...stat, value: e.target.value };
                              setFormData(prev => prev ? {
                                ...prev,
                                stats: newStats
                              } : prev);
                            }}
                            placeholder="420+"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`stat-${index}-label`}>
                            Opis
                          </Label>
                          <Input
                            id={`stat-${index}-label`}
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...formData.stats];
                              newStats[index] = { ...stat, label: e.target.value };
                              setFormData(prev => prev ? {
                                ...prev,
                                stats: newStats
                              } : prev);
                            }}
                            placeholder="Produktów w ofercie"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Sekcja Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactLabel">Mały nagłówek sekcji</Label>
                  <Input
                    id="contactLabel"
                    value={formData.contact.sectionLabel}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        contact: { ...prev.contact, sectionLabel: e.target.value }
                      } : prev)
                    }
                    placeholder="Skontaktuj się z nami"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactTitle">Główny tytuł</Label>
                  <Input
                    id="contactTitle"
                    value={formData.contact.title}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        contact: { ...prev.contact, title: e.target.value }
                      } : prev)
                    }
                    placeholder="Porozmawiajmy o Twoim projekcie"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactDesc">Opis</Label>
                  <Textarea
                    id="contactDesc"
                    value={formData.contact.description}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        contact: { ...prev.contact, description: e.target.value }
                      } : prev)
                    }
                    rows={3}
                    placeholder="Nasi specjaliści pomogą..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value }
                        } : prev)
                      }
                      placeholder="535-430-854"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneLink">Link telefonu (tel:)</Label>
                    <Input
                      id="phoneLink"
                      value={formData.contact.phoneLink}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, phoneLink: e.target.value }
                        } : prev)
                      }
                      placeholder="tel:+48535430854"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value }
                        } : prev)
                      }
                      placeholder="biuro@waterlife.net.pl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailLink">Link email (mailto:)</Label>
                    <Input
                      id="emailLink"
                      value={formData.contact.emailLink}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, emailLink: e.target.value }
                        } : prev)
                      }
                      placeholder="mailto:biuro@waterlife.net.pl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={formData.contact.address}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        contact: { ...prev.contact, address: e.target.value }
                      } : prev)
                    }
                    placeholder="Oborniki Śląskie, Polska"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Godziny pracy</Label>
                  <Input
                    id="workingHours"
                    value={formData.contact.workingHours}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        contact: { ...prev.contact, workingHours: e.target.value }
                      } : prev)
                    }
                    placeholder="Pon-Pt: 8:00 - 16:00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="formTitle">Tytuł formularza</Label>
                    <Input
                      id="formTitle"
                      value={formData.contact.formTitle}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, formTitle: e.target.value }
                        } : prev)
                      }
                      placeholder="Wyślij wiadomość"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formButtonText">Tekst przycisku</Label>
                    <Input
                      id="formButtonText"
                      value={formData.contact.formButtonText}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, formButtonText: e.target.value }
                        } : prev)
                      }
                      placeholder="Wyślij wiadomość"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Section */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Sekcja Kategorie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Intro */}
                <div className="space-y-4 border-b pb-6">
                  <h3 className="font-semibold">Nagłówek sekcji</h3>
                  <div className="space-y-2">
                    <Label htmlFor="categoriesLabel">Mały nagłówek</Label>
                    <Input
                      id="categoriesLabel"
                      value={formData.categoriesIntro.sectionLabel}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          categoriesIntro: { ...prev.categoriesIntro, sectionLabel: e.target.value }
                        } : prev)
                      }
                      placeholder="Nasze kategorie"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoriesTitle">Główny tytuł</Label>
                    <Input
                      id="categoriesTitle"
                      value={formData.categoriesIntro.title}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          categoriesIntro: { ...prev.categoriesIntro, title: e.target.value }
                        } : prev)
                      }
                      placeholder="Kompleksowe rozwiązania dla Twojego domu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoriesDescription">Opis</Label>
                    <Textarea
                      id="categoriesDescription"
                      value={formData.categoriesIntro.description}
                      onChange={(e) =>
                        setFormData(prev => prev ? {
                          ...prev,
                          categoriesIntro: { ...prev.categoriesIntro, description: e.target.value }
                        } : prev)
                      }
                      rows={3}
                      placeholder="Znajdź wszystko, czego potrzebujesz..."
                    />
                  </div>
                </div>

                {/* 3 karty kategorii */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Karty kategorii (3 elementy)</h3>
                  {formData.categoryCards.map((card, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="pt-6 space-y-4">
                        <Label className="text-sm font-medium">Kategoria {index + 1}</Label>
                        <div className="space-y-2">
                          <Label htmlFor={`card-${index}-title`}>Tytuł</Label>
                          <Input
                            id={`card-${index}-title`}
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...formData.categoryCards];
                              newCards[index] = { ...card, title: e.target.value };
                              setFormData(prev => prev ? {
                                ...prev,
                                categoryCards: newCards
                              } : prev);
                            }}
                            placeholder="Technika Grzewcza"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`card-${index}-desc`}>Opis</Label>
                          <Textarea
                            id={`card-${index}-desc`}
                            value={card.description}
                            onChange={(e) => {
                              const newCards = [...formData.categoryCards];
                              newCards[index] = { ...card, description: e.target.value };
                              setFormData(prev => prev ? {
                                ...prev,
                                categoryCards: newCards
                              } : prev);
                            }}
                            rows={2}
                            placeholder="Kotły gazowe, nagrzewnice..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`card-${index}-count`}>Licznik (np. &quot;180+ produktów&quot;)</Label>
                          <Input
                            id={`card-${index}-count`}
                            value={card.productCount}
                            onChange={(e) => {
                              const newCards = [...formData.categoryCards];
                              newCards[index] = { ...card, productCount: e.target.value };
                              setFormData(prev => prev ? {
                                ...prev,
                                categoryCards: newCards
                              } : prev);
                            }}
                            placeholder="180+ produktów"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`card-${index}-image`}>Ścieżka obrazu</Label>
                          <Input
                            id={`card-${index}-image`}
                            value={card.image}
                            onChange={(e) => {
                              const newCards = [...formData.categoryCards];
                              newCards[index] = { ...card, image: e.target.value };
                              setFormData(prev => prev ? {
                                ...prev,
                                categoryCards: newCards
                              } : prev);
                            }}
                            placeholder="/images/category-heating.jpg"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brands Section */}
          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <CardTitle>Sekcja Marki</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandsLabel">Nagłówek sekcji</Label>
                  <Input
                    id="brandsLabel"
                    value={formData.brands.sectionLabel}
                    onChange={(e) =>
                      setFormData(prev => prev ? {
                        ...prev,
                        brands: { ...prev.brands, sectionLabel: e.target.value }
                      } : prev)
                    }
                    placeholder="Współpracujemy z najlepszymi producentami"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="brandsList">
                    Lista marek (format: Nazwa|Link, każda w nowej linii)
                  </Label>
                  <Textarea
                    id="brandsList"
                    value={brandsText}
                    onChange={(e) => setBrandsText(e.target.value)}
                    rows={8}
                    placeholder="TERMET|https://termet.pl&#10;BOSCH|https://www.bosch.pl&#10;Atlantic"
                  />
                  <p className="text-sm text-muted-foreground">
                    Każda marka w nowej linii. Format: <code className="bg-muted px-1 py-0.5 rounded">Nazwa|Link</code> lub samo <code className="bg-muted px-1 py-0.5 rounded">Nazwa</code> (bez linku)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      <div className="text-sm text-muted-foreground text-center pt-4">
        Ostatnia aktualizacja: {new Date(content?.updatedAt || '').toLocaleString('pl-PL')}
      </div>
    </div>
  );
}
