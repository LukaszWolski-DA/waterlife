# WaterLife - Struktura Projektu

Sklep internetowy WaterLife zbudowany na Next.js 16 z App Router.

## 📁 Struktura katalogów

```
WaterLife/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Strony publiczne (widok klienta)
│   │   ├── layout.tsx            # Layout dla stron publicznych
│   │   ├── page.tsx              # Landing page / Strona główna
│   │   ├── produkty/
│   │   │   ├── page.tsx          # Lista wszystkich produktów
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Szczegóły pojedynczego produktu
│   │   ├── koszyk/
│   │   │   └── page.tsx          # Widok koszyka zakupowego
│   │   ├── zamowienie/
│   │   │   └── page.tsx          # Finalizacja zamówienia
│   │   └── kontakt/
│   │       └── page.tsx          # Formularz kontaktowy
│   │
│   ├── admin/                    # Panel administratora
│   │   ├── layout.tsx            # Layout dla panelu admina
│   │   ├── page.tsx              # Dashboard admina
│   │   ├── produkty/
│   │   │   ├── page.tsx          # Zarządzanie produktami (lista)
│   │   │   ├── dodaj/
│   │   │   │   └── page.tsx      # Dodawanie nowego produktu
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Edycja produktu
│   │   ├── zamowienia/
│   │   │   ├── page.tsx          # Lista zamówień
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Szczegóły zamówienia
│   │   └── wiadomosci/
│   │       └── page.tsx          # Wiadomości z formularza kontaktowego
│   │
│   └── api/                      # API Routes
│       ├── produkty/
│       │   └── route.ts          # GET, POST, PUT, DELETE - zarządzanie produktami
│       ├── zamowienia/
│       │   └── route.ts          # GET, POST, PUT - zarządzanie zamówieniami
│       ├── kontakt/
│       │   └── route.ts          # POST - wysyłanie wiadomości kontaktowych
│       └── upload/
│           └── route.ts          # POST, DELETE - upload plików
│
├── components/                   # Komponenty React
│   ├── layout/
│   │   ├── Header.tsx            # Nagłówek strony z nawigacją i koszykiem
│   │   ├── Footer.tsx            # Stopka strony
│   │   └── Navigation.tsx        # Menu nawigacyjne (panel admin)
│   ├── produkty/
│   │   ├── ProductCard.tsx       # Karta produktu (miniatura)
│   │   ├── ProductList.tsx       # Lista produktów (grid)
│   │   ├── ProductFilters.tsx    # Filtry produktów (sidebar)
│   │   └── ProductForm.tsx       # Formularz dodawania/edycji produktu
│   ├── koszyk/
│   │   ├── CartItem.tsx          # Pojedynczy element w koszyku
│   │   └── CartSummary.tsx       # Podsumowanie koszyka
│   └── forms/
│       └── ContactForm.tsx       # Formularz kontaktowy z załącznikiem
│
├── lib/                          # Biblioteki pomocnicze
│   ├── supabase.ts               # Konfiguracja klienta Supabase
│   └── validations.ts            # Schematy walidacji Zod
│
├── types/                        # Definicje typów TypeScript
│   ├── product.ts                # Typy dla produktów
│   ├── order.ts                  # Typy dla zamówień
│   └── contact.ts                # Typy dla wiadomości kontaktowych
│
├── hooks/                        # Custom React Hooks
│   ├── useCart.ts                # Hook do zarządzania koszykiem (Zustand)
│   └── useProducts.ts            # Hook do pobierania produktów
│
├── public/                       # Pliki statyczne
│   ├── images/                   # Obrazy statyczne
│   └── uploads/                  # Foldery na uploady użytkowników
│
└── styles/                       # Style CSS

```

## 🔧 Stack technologiczny

- **Framework**: Next.js 16 (App Router)
- **Język**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand (koszyk)
- **Walidacja**: Zod
- **Baza danych**: Supabase (do skonfigurowania)
- **Ikony**: Lucide React

## 🚀 Uruchomienie projektu

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Build produkcyjny
npm run build

# Start serwera produkcyjnego
npm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 📋 Funkcjonalności

### Strony publiczne
- ✅ Landing page z hero section i wyróżnionymi produktami
- ✅ Strona z listą produktów (filtry, sortowanie)
- ✅ Strona szczegółów produktu
- ✅ Koszyk zakupowy z możliwością zmiany ilości
- ✅ Formularz zamówienia z danymi dostawy
- ✅ Formularz kontaktowy z możliwością załączenia pliku

### Panel administratora
- ✅ Dashboard ze statystykami
- ✅ Zarządzanie produktami (CRUD)
- ✅ Lista zamówień z możliwością zmiany statusu
- ✅ Podgląd szczegółów zamówienia
- ✅ Lista wiadomości kontaktowych

### API Endpoints
- `GET /api/produkty` - pobierz wszystkie produkty
- `POST /api/produkty` - dodaj nowy produkt
- `PUT /api/produkty` - zaktualizuj produkt
- `DELETE /api/produkty` - usuń produkt
- `GET /api/zamowienia` - pobierz wszystkie zamówienia
- `POST /api/zamowienia` - utwórz nowe zamówienie
- `PUT /api/zamowienia` - zaktualizuj status zamówienia
- `POST /api/kontakt` - wyślij wiadomość kontaktową
- `POST /api/upload` - upload pliku
- `DELETE /api/upload` - usuń plik

## 🔜 Następne kroki

### Konfiguracja bazy danych (Supabase)
1. Utwórz projekt w Supabase
2. Dodaj zmienne środowiskowe w `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Utwórz tabele w Supabase:
   - `products` (produkty)
   - `orders` (zamówienia)
   - `order_items` (pozycje zamówień)
   - `contact_messages` (wiadomości kontaktowe)
4. Skonfiguruj Supabase Storage dla obrazów produktów i załączników

### Autoryzacja admina
- Dodaj middleware do sprawdzania autoryzacji w panelu admina
- Zaimplementuj logowanie dla administratorów

### Płatności
- Integracja z systemem płatności (Stripe, PayU, Przelewy24)

### Email
- Konfiguracja wysyłania emaili (potwierdzenia zamówień, powiadomienia)

### Optymalizacja
- Dodaj caching dla produktów
- Implementuj lazy loading dla obrazów
- Dodaj SEO metadata

## 📝 Notatki

- Wszystkie komponenty używają Tailwind CSS i shadcn/ui
- Komponenty klienckie są oznaczone dyrektywą `'use client'`
- Koszyk używa Zustand z persystencją w localStorage
- Walidacja formularzy używa Zod schemas
- TODO komentarze w kodzie wskazują miejsca wymagające implementacji

## 🎨 Design System

Projekt używa komponentów z shadcn/ui, które są już zainstalowane:
- Button, Input, Label, Textarea
- Card, Table, Checkbox, Slider
- Toast, Dialog, Select
- i wiele innych...

Kolory i style można modyfikować w `tailwind.config.js` i `globals.css`.
