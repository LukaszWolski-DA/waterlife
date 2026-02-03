# Instrukcja Wdrożenia: Koszyk Zakupowy (Uproszczona Architektura)

## 📋 Co zostało zaimplementowane

✅ **Tabela cart_items** - Skrypt SQL w `supabase/migrations/001_cart_items_table.sql` (historia zamówień)  
✅ **Typy TypeScript** - `types/cart.ts`  
✅ **Zustand Store** - `hooks/useCart.ts` (localStorage dla wszystkich)  
✅ **API Checkout** - `app/api/zapytanie/route.ts` (zapis do orders + cart_items)  
✅ **Strona koszyka** - `app/(public)/koszyk/page.tsx`  

---

## 🏗️ Architektura

### Uproszczony Flow (localStorage → DB tylko przy checkout)

```
┌─────────────────────────────────────────────┐
│  WSZYSCY UŻYTKOWNICY (Goście + Zalogowani) │
└─────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Dodaj do koszyka    │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  localStorage (Zustand)│ ← Persystencja (F5)
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Przeglądaj koszyk   │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │ "Wyślij zapytanie ofertowe"       │
        │ (POST /api/zapytanie)             │
        └───────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌──────────────────┐  ┌─────────────────────┐
│ Tabela: orders   │  │ Tabela: cart_items  │
│ (zamówienie)     │  │ (historia - tylko   │
│                  │  │  dla zalogowanych)  │
└──────────────────┘  └─────────────────────┘
         │
         ▼
┌──────────────────┐
│ Email (TODO)     │
└──────────────────┘
```

### Kluczowe Decyzje:

✅ **localStorage dla wszystkich** - goście i zalogowani używają tego samego mechanizmu  
✅ **Brak synchronizacji na bieżąco** - prosta implementacja, mniej zapytań do DB  
✅ **Zapis przy checkout** - orders + cart_items tworzone tylko gdy user składa zapytanie  
✅ **cart_items jako historia** - nie aktywny koszyk, tylko archiwum zamówień  

❌ **Brak multi-device sync** - koszyk NIE synchronizuje się między urządzeniami  
❌ **Brak API /api/cart** - nie ma endpoints do zarządzania koszykiem  

---

## 🚀 Kroki Wdrożenia

### Krok 1: Wykonaj Migrację Bazy Danych

1. Otwórz Supabase Dashboard: https://supabase.com/dashboard/project/qytutxbieaxwwgymsril
2. Przejdź do **SQL Editor** (ikona SQL po lewej stronie)
3. Kliknij **New query**
4. Skopiuj **CAŁĄ zawartość** pliku `supabase/migrations/001_cart_items_table.sql`
5. Wklej do edytora SQL
6. Kliknij **Run** (lub Ctrl+Enter)
7. Sprawdź czy widać komunikat: `Migration completed successfully!`

### Krok 2: Sprawdź Strukturę Tabel

W Supabase Dashboard przejdź do **Table Editor** i sprawdź:

**Tabela `cart_items`** powinna mieć kolumny:
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `product_id` (uuid, FK → products)
- `quantity` (int4)
- `price` (numeric)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Tabela `orders`** powinna mieć NOWE kolumny:
- `user_id` (uuid, nullable)
- `is_guest` (boolean)
- `cart_snapshot` (jsonb)

### Krok 3: Uruchom Aplikację

```bash
npm run dev
```

Aplikacja powinna być dostępna pod: http://localhost:3000

---

## 🧪 Testowanie

### Scenariusz 1: Gość → Koszyk → Checkout

1. **Otwórz aplikację w trybie incognito** (aby być niezalogowanym)
2. Przejdź na stronę `/produkty`
3. Dodaj kilka produktów do koszyka
4. **Sprawdzenie localStorage**:
   - Otwórz DevTools (F12) → Application → Local Storage
   - Powinieneś zobaczyć klucz `waterlife-cart` z danymi JSON
5. **Odśwież stronę (F5)** - koszyk powinien pozostać
6. Przejdź do `/koszyk`
7. Wypełnij formularz zapytania ofertowego
8. Kliknij "Wyślij zapytanie ofertowe"
9. **Sprawdzenie w Supabase**:
   - Otwórz Table Editor → `orders`
   - Powinieneś zobaczyć nowy rekord z:
     - `is_guest = true`
     - `user_id = NULL`
     - `cart_snapshot` zawiera dane koszyka
   - Tabela `cart_items` powinna być **PUSTA** (goście nie mają historii)
10. **Sprawdź localStorage** - powinien być wyczyszczony

### Scenariusz 2: Zalogowany → Koszyk → Checkout

1. **Zaloguj się**: `lukasz.wolski.m@gmail.com` / `qwerty123`
2. Dodaj 2-3 produkty do koszyka
3. **Sprawdź localStorage** - produkty zapisane lokalnie
4. Przejdź do `/koszyk` i złóż zamówienie
5. **Sprawdzenie w Supabase**:
   - **Tabela `orders`**:
     - `is_guest = false`
     - `user_id = <twój user ID>`
     - `cart_snapshot` zawiera dane
   - **Tabela `cart_items`**:
     - Powinieneś zobaczyć produkty z zamówienia
     - `user_id` = twój ID
     - To jest **historia zamówienia**, nie aktywny koszyk
6. **Sprawdź localStorage** - wyczyszczony po checkout

### Scenariusz 3: Persystencja (F5)

1. Dodaj produkty do koszyka
2. **Zamknij przeglądarkę**
3. **Otwórz ponownie** aplikację
4. Koszyk powinien zawierać te same produkty (localStorage persist)

### Scenariusz 4: Zmiana urządzenia

1. Zaloguj się na komputerze, dodaj produkty
2. Zaloguj się na telefonie (ten sam user)
3. ❌ **Koszyk NIE synchronizuje się** - to jest oczekiwane zachowanie
4. Każde urządzenie ma swój lokalny koszyk

---

## 🔍 Debugging

### Problemy z localStorage

**Sprawdź DevTools**:
```
F12 → Application → Local Storage → http://localhost:3000
Szukaj klucza: waterlife-cart
```

**Struktura danych**:
```json
{
  "state": {
    "items": [
      {
        "id": "product-uuid",
        "name": "Nazwa produktu",
        "price": 299.99,
        "quantity": 2,
        "imageUrl": "url"
      }
    ],
    "total": 599.98,
    "itemCount": 2
  },
  "version": 0
}
```

### Problemy z zapisem do Supabase

**Sprawdź Console w przeglądarce**:
```
=== NOWE ZAPYTANIE OFERTOWE ===
Numer zamówienia: WL-2026-123456
ID zamówienia: uuid-here
✅ Order saved to database
✅ Cart items saved as history: 3 items
```

**Lub błędy**:
```
❌ Error saving order: ...
❌ Error saving cart history: ...
```

---

## 📊 Struktura Bazy Danych

### Tabela: orders

```sql
orders (
  id uuid PRIMARY KEY,
  order_number varchar,
  customer_name varchar,
  email varchar,
  phone varchar,
  company varchar NULL,
  nip varchar NULL,
  notes text NULL,
  subtotal numeric,
  delivery_cost numeric,
  total numeric,
  status varchar,
  user_id uuid NULL,           -- ← NOWA KOLUMNA
  is_guest boolean DEFAULT false, -- ← NOWA KOLUMNA
  cart_snapshot jsonb NULL,    -- ← NOWA KOLUMNA
  created_at timestamptz,
  updated_at timestamptz
)
```

### Tabela: cart_items (Historia)

```sql
cart_items (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  UNIQUE(user_id, product_id)  -- Jeden produkt na user
)
```

**WAŻNE**: `cart_items` NIE jest aktywnym koszykiem!  
To archiwum produktów z zamówień zalogowanych użytkowników.

---

## 📝 Struktura Kodu

```
app/
  ├── (public)/
  │   └── koszyk/
  │       └── page.tsx              # Strona koszyka + formularz checkout
  ├── api/
  │   └── zapytanie/
  │       └── route.ts              # Checkout API (zapis do orders + cart_items)
  └── layout.tsx                    # Główny layout

components/
  └── koszyk/
      ├── CartItem.tsx              # Pojedynczy item w koszyku
      └── CartSummary.tsx           # Podsumowanie koszyka

hooks/
  └── useCart.ts                    # Zustand store (localStorage)

types/
  └── cart.ts                       # Interfejsy TypeScript

supabase/
  └── migrations/
      └── 001_cart_items_table.sql  # Migracja SQL
```

---

## ✅ Checklist Wdrożenia

- [ ] Wykonano migrację SQL w Supabase
- [ ] Sprawdzono strukturę tabel (cart_items, orders)
- [ ] Uruchomiono aplikację (`npm run dev`)
- [ ] Przetestowano Scenariusz 1 (Gość → Checkout)
- [ ] Przetestowano Scenariusz 2 (Zalogowany → Checkout)
- [ ] Przetestowano Scenariusz 3 (Persystencja F5)
- [ ] Sprawdzono logi w konsoli (brak błędów)
- [ ] Sprawdzono dane w Supabase (orders, cart_items)

---

## 🔮 Przyszłe Rozszerzenia (Opcjonalne)

Jeśli w przyszłości będziesz potrzebować synchronizacji między urządzeniami:

1. **Przywróć `/api/cart`** - endpoints GET/POST/PATCH/DELETE
2. **Dodaj `CartSync`** - komponent synchronizacji po logowaniu
3. **Zaktualizuj `useCart`** - dodaj auto-sync dla zalogowanych
4. **Merge localStorage → DB** - przy logowaniu

Wszystkie te pliki były już napisane, ale usunięte dla uproszczenia.
Możesz je znaleźć w historii git.

---

## 🎉 Gratulacje!

Masz teraz prosty, działający system koszyka zakupowego!

### Co masz:
- ✅ localStorage dla wszystkich użytkowników
- ✅ Persystencja (F5 nie czyści koszyka)
- ✅ Zamówienia zapisywane w bazie
- ✅ Historia produktów dla zalogowanych
- ✅ Prosta, szybka implementacja

### Czego NIE masz (świadomie):
- ❌ Synchronizacja między urządzeniami
- ❌ Real-time updates koszyka
- ❌ API do zarządzania koszykiem

**To jest OK!** Dla większości e-commerce wystarczy localStorage.

---

## 📞 Pomoc

Jeśli napotkasz problemy:

1. Sprawdź Console w DevTools (F12)
2. Sprawdź localStorage: Application → Local Storage
3. Sprawdź Supabase Logs: Dashboard → Logs → API
4. Sprawdź czy migracja SQL została poprawnie wykonana
5. Sprawdź strukturę tabel w Table Editor

---

**Data aktualizacji**: 2026-02-03  
**Wersja**: 2.0 (Uproszczona)  
**Autor**: Cursor AI Assistant
