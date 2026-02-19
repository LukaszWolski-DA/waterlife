# Migracja Homepage Content: localStorage → Supabase

**Data migracji:** 2026-02-04  
**Status:** ✅ Gotowe do wdrożenia

---

## 📋 Co zostało zrobione?

Treści strony głównej zostały przeniesione z **localStorage** (przeglądarka) do **Supabase** (baza danych).

### ✅ **Zmiany zaimplementowane:**

1. **Migracja SQL** (`supabase/migrations/003_homepage_content_full.sql`)
   - Pełna struktura homepage w jednym rekordzie (section = 'homepage')
   - RLS policies (public read, authenticated write)

2. **API Routes** (`app/api/homepage/`)
   - `GET /api/homepage` - pobiera treści (public)
   - `POST /api/homepage` - aktualizuje treści (wymaga auth)
   - `POST /api/homepage/reset` - przywraca domyślne (wymaga auth)

3. **Refactoring bibliotek** (`lib/homepage-store.ts`)
   - Wszystkie funkcje teraz async
   - Wywołują API zamiast localStorage
   - `initializeHomepageStore()` → deprecated (no-op)

4. **Hook update** (`hooks/use-homepage-admin.ts`)
   - Async/await dla wszystkich operacji
   - Lepsze error handling

5. **Frontend update** (komponenty sekcji)
   - `hero-section.tsx` ✅
   - `stats-section.tsx` ✅
   - `contact-section.tsx` ✅
   - `categories-section.tsx` ✅
   - `brands-section.tsx` ✅
   - Wszystkie używają async `getHomepageContent()`

---

## 🚀 Jak wdrożyć migrację?

### **Krok 1: Uruchom migrację SQL w Supabase**

1. Otwórz **Supabase Dashboard** → zakładka **SQL Editor**
2. Skopiuj zawartość pliku:
   ```
   supabase/migrations/003_homepage_content_full.sql
   ```
3. Wklej do SQL Editor i kliknij **RUN**
4. Powinno pojawić się: `Success: no rows returned`

**Co robi ta migracja:**
- Usuwa stare dane (jeśli były)
- Wstawia pełną strukturę homepage (hero, stats, contact, categories, brands)
- Ustawia RLS policies (public read, auth write)

---

### **Krok 2: Przetestuj API endpoints**

**Test 1: Pobierz homepage content**
```bash
curl http://localhost:3000/api/homepage
```

**Oczekiwany wynik:** JSON z pełną strukturą homepage

**Test 2: Panel admina**
1. Zaloguj się jako admin: `http://localhost:3000/admin`
2. Przejdź do: `http://localhost:3000/admin/strona-glowna`
3. Zmień jakąś wartość (np. tytuł Hero)
4. Kliknij **"Zapisz zmiany"**
5. Odśwież stronę główną `http://localhost:3000` → sprawdź czy zmiana się pokazała

---

### **Krok 3: Sprawdź stronę główną**

1. Otwórz: `http://localhost:3000`
2. Sprawdź czy wszystkie sekcje się wyświetlają:
   - ✅ Hero (banner z przyciskami)
   - ✅ Statystyki (420+, 15+, 98%, 24h)
   - ✅ Kategorie (3 karty)
   - ✅ Marki (8 producentów)
   - ✅ Kontakt (formularz + dane)

---

## 🔍 Debugowanie

### Problem: "Failed to load homepage content"

**Przyczyna:** API nie może pobrać danych z Supabase

**Rozwiązanie:**
1. Sprawdź czy migracja SQL została wykonana:
   ```sql
   SELECT * FROM homepage_content WHERE section = 'homepage';
   ```
2. Sprawdź RLS policies w Supabase Dashboard → Table Editor → homepage_content
3. Sprawdź logi w konsoli przeglądarki (F12)

---

### Problem: "Unauthorized" przy zapisie

**Przyczyna:** User nie jest zalogowany lub nie ma uprawnień

**Rozwiązanie:**
1. Zaloguj się jako admin w `/admin/login`
2. TODO: Dodaj sprawdzenie czy user jest adminem (obecnie każdy zalogowany może edytować)

---

## 📊 Struktura danych w Supabase

**Tabela:** `homepage_content`  
**Sekcja:** `homepage` (jedna kolumna `content` typu JSONB)

```json
{
  "hero": {
    "companyName": "Waterlife s.c.",
    "mainTitle": "...",
    "subtitle": "...",
    "ctaButtonPrimary": "...",
    "ctaButtonSecondary": "...",
    "benefits": [...]
  },
  "stats": [...],
  "contact": {...},
  "categoriesIntro": {...},
  "categoryCards": [...],
  "brands": {
    "sectionLabel": "...",
    "brands": [...]
  }
}
```

---

## ⚠️ UWAGA: localStorage jest deprecated

Po wdrożeniu migracji:
- ❌ **NIE używaj** localStorage dla homepage content
- ❌ **NIE używaj** `initializeHomepageStore()` (deprecated)
- ✅ **UŻYWAJ** API endpoints

**localStorage NIE jest usuwany automatycznie** (dla bezpieczeństwa).  
Możesz go ręcznie wyczyścić w konsoli:
```javascript
localStorage.removeItem('waterlife_homepage');
```

---

## 🎯 Korzyści po migracji

✅ **Dane bezpieczne w chmurze** - nie znikną przy zmianie przeglądarki  
✅ **Dostęp z każdego urządzenia** - admin może edytować z laptopa/telefonu  
✅ **Backup automatyczny** - Supabase trzyma backup  
✅ **Historia zmian** - timestamp `updated_at` śledzi modyfikacje  
✅ **Konsystentne z resztą aplikacji** - wszystko w Supabase

---

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli przeglądarki (F12)
2. Sprawdź logi API w terminal (gdzie działa `npm run dev`)
3. Sprawdź Supabase Dashboard → Table Editor → homepage_content

---

**Autor:** AI Assistant  
**Data:** 2026-02-04  
**Wersja:** 1.0
