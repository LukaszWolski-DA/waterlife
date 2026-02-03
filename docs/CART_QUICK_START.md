# 🚀 Quick Start: Hybrydowy Koszyk

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

**Test 1: Gość**
1. Otwórz w incognito: http://localhost:3000/produkty
2. Dodaj produkty do koszyka
3. Przejdź do: http://localhost:3000/koszyk
4. Wypełnij formularz i wyślij

**Test 2: Logowanie + Merge**
1. Jako gość dodaj 2 produkty
2. Zaloguj się: `lukasz.wolski.m@gmail.com` / `qwerty123`
3. Zobaczysz toast: "Koszyk zsynchronizowany"
4. Sprawdź `/koszyk` - produkty tam są!

---

## ✅ Gotowe!

Pełna dokumentacja: [`docs/CART_IMPLEMENTATION.md`](docs/CART_IMPLEMENTATION.md)

## 🔍 Sprawdź w Supabase

**Cart Items**: https://supabase.com/dashboard/project/qytutxbieaxwwgymsril/editor/28519  
**Orders**: https://supabase.com/dashboard/project/qytutxbieaxwwgymsril/editor/28518

---

## 💡 Najważniejsze Pliki

- `supabase/migrations/001_cart_items_table.sql` - SQL do wykonania
- `components/CartSync.tsx` - Auto-sync po logowaniu
- `app/api/cart/route.ts` - API endpoint
- `lib/supabase/cart.ts` - Funkcje CRUD
- `hooks/useCart.ts` - Zustand store (zaktualizowany)
