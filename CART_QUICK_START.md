# 🚀 Quick Start: Koszyk Zakupowy

## ⚡ Szybkie Uruchomienie (5 minut)

### 1️⃣ Wykonaj Migrację SQL

1. Otwórz: https://supabase.com/dashboard/project/qytutxbieaxwwgymsril/sql/new
2. Skopiuj CAŁĄ zawartość: `supabase/migrations/001_cart_items_table.sql`
3. Wklej i kliknij **RUN**
4. Poczekaj na: `Migration completed successfully!`

### 2️⃣ Uruchom Aplikację

```bash
npm run dev
```

### 3️⃣ Testuj!

**Test 1: Dodaj produkty (localStorage)**
1. Otwórz: http://localhost:3000/produkty
2. Dodaj kilka produktów do koszyka
3. Odśwież stronę (F5) - koszyk pozostaje
4. Sprawdź DevTools → Application → Local Storage → `waterlife-cart`

**Test 2: Checkout**
1. Przejdź do: http://localhost:3000/koszyk
2. Wypełnij formularz zapytania ofertowego
3. Kliknij "Wyślij zapytanie ofertowe"
4. Sprawdź Supabase → tabela `orders` (nowe zamówienie)
5. Jeśli zalogowany → sprawdź `cart_items` (historia produktów)

---

## ✅ Gotowe!

Pełna dokumentacja: [`docs/CART_IMPLEMENTATION.md`](docs/CART_IMPLEMENTATION.md)

## 🔍 Sprawdź w Supabase

**Orders**: https://supabase.com/dashboard/project/qytutxbieaxwwgymsril/editor (tabela orders)  
**Cart Items**: https://supabase.com/dashboard/project/qytutxbieaxwwgymsril/editor (tabela cart_items - historia)

---

## 💡 Architektura

**Wszyscy użytkownicy (goście + zalogowani):**
- Koszyk przechowywany w localStorage (Zustand persist)
- Odświeżenie strony (F5) → koszyk pozostaje

**Przy checkout ("Wyślij zapytanie ofertowe"):**
- Zapis do tabeli `orders` (zamówienie)
- Jeśli zalogowany → zapis do `cart_items` (historia produktów)
- localStorage zostaje wyczyszczony

## 💡 Najważniejsze Pliki

- `supabase/migrations/001_cart_items_table.sql` - SQL do wykonania
- `hooks/useCart.ts` - Zustand store (localStorage)
- `app/api/zapytanie/route.ts` - Checkout API (zapis do orders + cart_items)
- `app/(public)/koszyk/page.tsx` - Strona koszyka
- `types/cart.ts` - Interfejsy TypeScript
