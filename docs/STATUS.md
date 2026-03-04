# WaterLife - Status Projektu i Lista Zadań

**Data utworzenia:** 2026-01-29
**Ostatnia aktualizacja:** 2026-01-29
**Status po implementacji Base Case:** ✅ Strona działa, build przechodzi, TypeScript OK

---

## 📊 PROGRESS TRACKER

**Ukończone:** 0/10
**W trakcie:** 0/10
**Do zrobienia:** 10/10

**Legenda statusów:**
- 🔴 **DO ZROBIENIA** - Nie rozpoczęte
- 🟡 **W TRAKCIE** - W implementacji
- ✅ **GOTOWE** - Ukończone i przetestowane
- ⏸️ **WSTRZYMANE** - Odłożone na później

---

## ✅ CO DZIAŁA POPRAWNIE

### Nawigacja
- ✅ Header navigation z linkami
- ✅ Mobile menu (responsive)
- ✅ Smooth scroll do sekcji
- ✅ Routing między stronami

### Strona Główna
- ✅ Hero Section
- ✅ Products Section (wyświetla produkty z localStorage)
- ✅ Categories Section
- ✅ Stats Section
- ✅ Brands Section
- ✅ Contact Section

### Produkty
- ✅ Lista produktów (`/produkty`)
- ✅ Szczegóły produktu (`/produkty/[id]`)
- ✅ Wyświetlanie zdjęć (zoptymalizowane WebP/AVIF)
- ✅ Dodawanie do koszyka z każdego miejsca

### Koszyk
- ✅ Wyświetlanie produktów
- ✅ Zmiana ilości (+/- oraz input)
- ✅ Usuwanie produktów
- ✅ Persistence w localStorage (Zustand)
- ✅ Podsumowanie (total, dostawa, suma)

### Panel Admin - Produkty
- ✅ Lista produktów w tabeli
- ✅ Dodawanie nowego produktu (`/admin/produkty/dodaj`)
- ✅ Edycja produktu (`/admin/produkty/[id]`)
- ✅ Usuwanie produktu (z confirmation dialog)
- ✅ Upload zdjęć (drag-and-drop do `/public/images/products/`)
- ✅ Walidacja formularzy (Zod)
- ✅ Filtry w adminie (search + kategoria) - DZIAŁAJĄ

### Formularz Kontaktowy
- ✅ Pola: imię, email, temat, wiadomość, załącznik
- ✅ Walidacja formularza
- ✅ Submit do `/api/kontakt`

### Konfiguracja
- ✅ TypeScript strict mode (bez błędów)
- ✅ Next.js image optimization
- ✅ Security headers
- ✅ SEO metadata (Open Graph, Twitter Cards)
- ✅ Environment variables template (.env.example)

### Inne
- ✅ Mobile responsiveness
- ✅ Loading states (skeletons, spinners)
- ✅ Error handling (try-catch, error boundaries)
- ✅ Toast notifications

---

## 🎯 CORE/BASE CASES - SZCZEGÓŁOWY TRACKING

### 🟠 PRIORITY 2 - CORE FUNCTIONALITY (User Priority)

#### CASE 2: Filtry Produktów
**Status:** 🔴 DO ZROBIENIA
**Opis:** UI filtrów istnieje ale nie filtruje produktów
**Priorytet:** Wysoki (Core UX)

**Co zrobić:**
- Połączyć state z `ProductFilters` z `useProducts` hook
- Kategorie (checkboxy)
- Zakres ceny (slider)
- Dostępność (toggle "Tylko dostępne")

**Files:**
- `components/produkty/ProductFilters.tsx`
- `hooks/useProducts.ts`
- `app/(public)/produkty/page.tsx`

**Acceptance Criteria:**
- [ ] Filtry kategorii działają
- [ ] Slider ceny filtruje produkty
- [ ] Toggle "tylko dostępne" działa
- [ ] Licznik "Wyświetlono X z Y produktów" aktualizuje się
- [ ] Można wyczyścić wszystkie filtry
- [ ] URL params reflect filters (optional)

**Notatki:**
_[Miejsce na Twoje obserwacje podczas implementacji]_

---

#### CASE 8: Wyszukiwanie Produktów
**Status:** 🔴 DO ZROBIENIA
**Opis:** Search input w headerze bez logiki
**Priorytet:** Wysoki (Core UX)

**Co zrobić:**
- Dodać handler onSubmit/onChange do search input
- Filtrować produkty po nazwie i opisie
- Przekierować do `/produkty?search=query`
- Highlight search results

**Files:**
- `components/layout/Header.tsx`
- `hooks/useProducts.ts`
- `app/(public)/produkty/page.tsx`

**Acceptance Criteria:**
- [ ] Search input w headerze działa
- [ ] Enter lub click na search icon wyszukuje
- [ ] Redirect do `/produkty` z query param
- [ ] Produkty filtrowane po nazwie i opisie
- [ ] "Brak wyników" message gdy 0 produktów
- [ ] Clear search button

**Notatki:**
_[Miejsce na Twoje obserwacje podczas implementacji]_

---

#### CASE 7: Formularz Zamówienia - Flow
**Status:** 🔴 DO ZROBIENIA
**Opis:** Niejasne - dwie strony zamówienia
**Priorytet:** Średni (wymaga decyzji biznesowej)

**Decyzja potrzebna:**
- Czy `/koszyk` to zapytanie ofertowe (B2B)?
- Czy `/zamowienie` to checkout (B2C)?
- Jedna czy dwie ścieżki?

**Options:**
- A) Jedna ścieżka - tylko `/koszyk` z zapytaniem ofertowym
- B) Dwie ścieżki - `/koszyk` dla B2B, `/zamowienie` dla B2C
- C) Jedna ścieżka - tylko `/zamowienie` jako checkout

**Files:**
- `app/koszyk/page.tsx`
- `app/(public)/zamowienie/page.tsx`
- `lib/orders-store.ts` (do stworzenia?)

**Acceptance Criteria (po decyzji):**
- [ ] Flow jest jasny
- [ ] Formularz walidowany
- [ ] Dane zapisywane (localStorage lub Supabase)
- [ ] Email wysyłany (gdy email service gotowy)
- [ ] Redirect po submit
- [ ] Toast confirmation

**Notatki:**
_[Decyzja usera: ...]_

---

### 🔴 PRIORITY 1 - SECURITY

#### CASE 1: Autentykacja Admin
**Status:** 🔴 DO ZROBIENIA
**Opis:** Panel `/admin` dostępny publicznie
**Priorytet:** KRYTYCZNY (security vulnerability)

**Co zrobić:**
- Middleware chroniące `/admin/*`
- Login page (`/admin/login`)
- Session management (cookies)
- Logout button
- Password hashing

**Files:**
- `middleware.ts` (nowy)
- `app/admin/login/page.tsx` (nowy)
- `lib/auth.ts` (nowy)
- `app/admin/layout.tsx` (dodać logout)

**Acceptance Criteria:**
- [ ] Middleware redirect do /admin/login
- [ ] Login form z walidacją
- [ ] Secure session cookies
- [ ] Logout functionality
- [ ] Hash password z bcrypt
- [ ] "Logged in as Admin" indicator

**Notatki:**
_[Miejsce na Twoje obserwacje podczas implementacji]_

---

### 🟡 PRIORITY 3 - EMAIL/BACKEND

#### CASE 3: Email Service
**Status:** 🔴 DO ZROBIENIA
**Opis:** Wszystkie formularze tylko console.log
**Priorytet:** Wysoki (funkcjonalność kluczowa)

**Co zrobić:**
- Integracja z Resend
- Email templates
- Kontakt → admin notification
- Zapytanie ofertowe → admin notification
- Zamówienie → confirmation do klienta + admin

**Files:**
- `lib/email.ts` (nowy)
- `api/kontakt/route.ts`
- `api/zapytanie/route.ts`
- `api/zamowienia/route.ts` (gdy będzie)

**Acceptance Criteria:**
- [ ] Resend API key w .env
- [ ] Formularz kontaktowy wysyła email
- [ ] Zapytanie ofertowe wysyła email
- [ ] Email templates (HTML)
- [ ] Error handling
- [ ] Toast na success/error

**Notatki:**
_[Miejsce na Twoje obserwacje podczas implementacji]_

---

#### CASE 4: Zamówienia w Admin
**Status:** 🔴 DO ZROBIENIA
**Opis:** Panel zamówień pusty (empty array)
**Priorytet:** Średni

**Co zrobić:**
- Zdecydować: localStorage vs Supabase
- Stworzyć orders-store lub Supabase integration
- Lista zamówień w tabeli
- Szczegóły zamówienia
- Status update

**Files:**
- `lib/orders-store.ts` (nowy, jeśli localStorage)
- `app/admin/zamowienia/page.tsx`
- `app/admin/zamowienia/[id]/page.tsx`

**Acceptance Criteria:**
- [ ] Lista zamówień wyświetla dane
- [ ] Sortowanie po dacie
- [ ] Status badges (pending, processing, etc.)
- [ ] Szczegóły zamówienia (produkty, klient, total)
- [ ] Update status
- [ ] Delete order

**Notatki:**
_[Decyzja storage: localStorage / Supabase]_

---

#### CASE 5: Wiadomości w Admin
**Status:** 🔴 DO ZROBIENIA
**Opis:** Panel wiadomości pusty
**Priorytet:** Średni

**Co zrobić:**
- messages-store lub Supabase
- Lista wiadomości kontaktowych
- Mark as read/unread
- Delete message

**Files:**
- `lib/messages-store.ts` (nowy, jeśli localStorage)
- `app/admin/wiadomosci/page.tsx`

**Acceptance Criteria:**
- [ ] Lista wiadomości
- [ ] Sortowanie po dacie
- [ ] Read/unread status
- [ ] View message details
- [ ] Delete message
- [ ] Search/filter

**Notatki:**
_[Decyzja storage: localStorage / Supabase]_

---

### 🟢 PRIORITY 4 - UX IMPROVEMENTS

#### CASE 6: Dark Mode Toggle
**Status:** 🔴 DO ZROBIENIA
**Opis:** ThemeProvider jest, brak UI toggle
**Priorytet:** Niski (nice-to-have)

**Co zrobić:**
- Button w headerze
- Sun/Moon icon
- Smooth transition
- Persist preference

**Files:**
- `components/layout/Header.tsx`

**Acceptance Criteria:**
- [ ] Toggle button w headerze (desktop)
- [ ] Toggle w mobile menu
- [ ] Smooth theme transition
- [ ] Icons change (sun ↔ moon)
- [ ] Works on all pages

**Notatki:**
_[Szybka wygrana - ~15 min]_

---

#### CASE 9: Breadcrumbs
**Status:** 🔴 DO ZROBIENIA
**Opis:** Tylko prosty "Powrót" na stronie produktu
**Priorytet:** Niski (UX polish)

**Co zrobić:**
- Breadcrumb component
- Home > Produkty > [Kategoria] > [Nazwa]
- Implementacja na kluczowych stronach

**Files:**
- `components/ui/Breadcrumbs.tsx` (nowy)
- `app/(public)/produkty/[id]/page.tsx`
- Inne strony (optional)

**Acceptance Criteria:**
- [ ] Breadcrumbs na stronie produktu
- [ ] Poprawny trail z kategoriami
- [ ] Clickable links
- [ ] Responsive
- [ ] Separator icons

**Notatki:**
_[Miejsce na Twoje obserwacje podczas implementacji]_

---

#### CASE 10: Footer Links
**Status:** 🔴 DO ZROBIENIA
**Opis:** Większość linków to "#"
**Priorytet:** Niski (polish)

**Co zrobić:**
- Zdecydować: dodać strony czy usunąć linki
- O Nas, Regulamin, Polityka prywatności

**Files:**
- `components/layout/Footer.tsx`
- Nowe strony w `app/` (jeśli będą)

**Acceptance Criteria:**
- [ ] Decyzja: dodać strony czy usunąć
- [ ] Footer bez "#" linków
- [ ] Konsystentny design

**Notatki:**
_[Decyzja: ...]_

---

## 📋 KOLEJNOŚĆ IMPLEMENTACJI

**Faza 1: Core Functionality**
1. 🔴 CASE 2: Filtry produktów
2. 🔴 CASE 8: Wyszukiwanie
3. 🔴 CASE 7: Flow zamówienia (wymaga decyzji)

**Faza 2: Security**
4. 🔴 CASE 1: Autentykacja admin

**Faza 3: Backend/Data**
5. 🔴 CASE 4: Zamówienia w admin
6. 🔴 CASE 5: Wiadomości w admin
7. 🔴 CASE 3: Email service

**Faza 4: Polish**
8. 🔴 CASE 6: Dark mode
9. 🔴 CASE 9: Breadcrumbs
10. 🔴 CASE 10: Footer links

---

## 📝 TODO KOMENTARZE W KODZIE (14 sztuk)

**API Endpoints:**
1. `/api/kontakt` - 4 TODO (walidacja, upload, zapis do DB, email)
2. `/api/zapytanie` - 1 TODO (email)
3. `/api/upload` - 2 TODO (walidacja, Supabase Storage)
4. `/api/produkty` - TODO w komentarzach dot. autoryzacji
5. `/api/zamowienia` - TODO autoryzacja, Supabase

**Pages:**
6. `/app/admin/page.tsx` - TODO statystyki
7. `/app/admin/zamowienia/page.tsx` - TODO pobierz zamówienia
8. `/app/admin/wiadomosci/page.tsx` - TODO pobierz wiadomości
9. `/app/(public)/zamowienie/page.tsx` - 2 TODO (wysyłka, redirect)

**Components:**
10. `ProductFilters.tsx` - TODO kategorie z API

---

## 🚨 ZNANE PROBLEMY

### KRYTYCZNE
- ❌ Brak autentykacji na `/admin` - każdy może wejść
- ❌ Email nie jest wysyłany (tylko console.log)
- ❌ Upload załączników nie działa

### UX
- ❌ Filtry produktów nie działają (UI bez logiki)
- ❌ Wyszukiwanie w headerze nie działa
- ⚠️ Dark mode provider jest ale brak togglea

### BACKEND/DATA
- ❌ Panel zamówień pusty (empty array)
- ❌ Panel wiadomości pusty (empty array)
- ❌ Dashboard statystyki na 0

### STRUKTURA
- ⚠️ Dwie strony zamówienia - niejasny flow
- ⚠️ Footer links większość "#"
- ⚠️ Breadcrumbs niepełne

---

## 📊 CHANGELOG

### 2026-01-29
- ✅ Utworzono STATUS.md jako główny plik trackingowy projektu
- ✅ Zakończono Base Case implementation:
  - Fixed TypeScript errors (4 fixes)
  - Updated next.config.mjs (image optimization, security headers)
  - Enhanced SEO metadata (Open Graph, Twitter Cards)
  - Created .env.example
- ✅ Panel admin CRUD dla produktów w pełni funkcjonalny
- ✅ Upload zdjęć z drag-and-drop działa
- ✅ Synchronizacja localStorage między admin a public pages

---

## 🎯 NASTĘPNE KROKI

**Obecnie:** Gotowi do rozpoczęcia CORE FUNCTIONALITY cases
**Priorytet:** User wybrał CORE FIRST approach

**Do ustalenia z userem:**
- Który case zaatakować jako pierwszy? (sugestia: CASE 2 lub CASE 6)
- CASE 7: Decyzja o flow zamówienia (jedna czy dwie ścieżki?)
- CASE 4-5: localStorage czy Supabase dla zamówień/wiadomości?

---

**Ostatnia aktualizacja:** 2026-01-29
