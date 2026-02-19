# Use Cases - Panel Administratora

Wymagania funkcjonalne dla panelu administracyjnego WaterLife.

---

## Use Case 1: Konfiguracja kategorii produktow
**Status: ZAIMPLEMENTOWANE**

Konfiguracja (edycja, dodawanie, usuwanie) kategorii produktow.
W aplikacji http://localhost:3000/admin zakladka Kategorie Produktow.
Tutaj mozna dodawac kategorie, ich opis oraz slowa kluczowe do wyszukiwarki.

**Cel:** Mozliwosc edycji danych kategorii (oraz innych cech) w panelu admin.

---

## Use Case 2: Edycja strony glownej
**Status: ZAIMPLEMENTOWANE**

Mozliwosc edycji czesci atrybutow / wartosci na stronie main - http://localhost:3000
Zakladka w admin - "Strona Glowna" z sekcjami, np. "Hero Main - tekst".

**Cel:** Sterowanie niektorymi wartosciami i trescia na stronie glownej - bez zmiany kodu.

---

## Use Case 3: Format cen
**Status: ZAIMPLEMENTOWANE**

Wyswietlanie wszystkich cen w formacie `a bbb.cc`
Przyklad: cena 12000.45 wyswietlana jako `12 000.45`

**Cel:** Lepsza percepcja i widocznosc cen dla klienta koncowego.

---

## Use Case 4: Zarzadzanie producentami
**Status: ZAIMPLEMENTOWANE**

Mozliwosc dodawania, edycji, usuwania producentow w panelu Admin.
Przy dodawaniu produktow mozliwosc wyboru producenta lub wpisania nowego.

**Cel:** Klienci chca kupowac produkty od konkretnych producentow.

---

## Use Case 5: System logowania admina
**Status: ZAIMPLEMENTOWANE**

System logowania dla admina (base case bez bazy danych).
Credentials: uzytkownik `waterlife`, haslo `admin`

**Cel:** Ochrona panelu administracyjnego.

---

## Use Case 6: Zdjecia produktow
**Status: ZAIMPLEMENTOWANE**

- Poprawa skalowania zdjec przy podgladzie produktu
- Mozliwosc dodania trzech zdjec z checkboxem na glowne zdjecie
- Glowne zdjecie wyswietlane na karcie produktu

**Cel:** Lepsze wyswietlanie zdjec produktow.

---

## Use Case 7: Import/Eksport CSV
**Status: DO ZAIMPLEMENTOWANIA**

Mozliwosc importu listy produktow z CSV (przydatne przy dodawaniu wielu produktow).
Analogicznie - eksport listy produktow do CSV.

**Cel:** Masowe zarzadzanie produktami.

## Use Case 8: Zamówienia widoczne w http://localhost:3000/admin/zamowienia
Chciałbym widzieć wszystkie zamówienia w http://localhost:3000/admin/zamowienia.
Proponuję podział - zakładkę dla obsłużonych oraz nowych / w trakcie.
Załadowanie obsłużonych - tylko po wejściu na zakładkę osbłużone - od razu może być z paginacją - np. 20 i dalej, pokaż kolejne.
Dla aktywnych / w trakcie - pokaż wszystkie. Tutaj uwaga: admin będzie mógł zmienić status.
W ogóle - trzeba pomyśleć o statusach... tego jeszcze nie wiem, ale zakładam, że statusy to:
Złożone, W trakcie, Zrealizowano, Anulowano.

## Use Case 9: http://localhost:3000/admin/zamowienia
Przypadek 1: Widzę kolumnę data - która pokazuje kiedy wpadło zamówienie - zmieńmy nagłówek na Kiedy
Przypadek 2: Warto by dodać faktyczną datę w formacie YYYY-MM-DD HH:SS abym widział dokładną datę złożenia zamówienia
Przypadek 3: Filtrowanie tabeli zamówień - Aktywnych oraz Obsłużonych - zdaję się na Twoją rekomendację! Ma być praktyczne od strony administracji zamównieniami.

## Use Case 10: http://localhost:3000/admin/strona-glowna
Jak zapewne wiesz przeniosłem proste modyfikacje oraz treści strony głównej do http://localhost:3000/admin/strona-glowna
Upewnij się, że wszystkie elementy mamy obsłużone - mam już na supabase tabelę:
create table public.homepage_content (
  id uuid not null default extensions.uuid_generate_v4 (),
  section text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint homepage_content_pkey primary key (id),
  constraint homepage_content_section_key unique (section)
) TABLESPACE pg_default;

create index IF not exists idx_homepage_section on public.homepage_content using btree (section) TABLESPACE pg_default;

create trigger update_homepage_content_updated_at BEFORE
update on homepage_content for EACH row
execute FUNCTION update_updated_at_column ();

Dane w kolumnie content to:
{
  "benefits": [
    {
      "title": "Szybka Dostawa",
      "description": "Realizacja w 24h"
    },
    {
      "title": "Gwarancja Jakości",
      "description": "Certyfikowane produkty"
    },
    {
      "title": "Wsparcie Techniczne",
      "description": "Pomoc ekspertów"
    }
  ],
  "subtitle": "Kompleksowa obsługa instalacji wodnych, kanalizacyjnych i systemów ogrzewania dla Twojego domu i firmy.",
  "mainTitle": "Profesjonalne Rozwiązania Hydrauliczne i Grzewcze",
  "companyName": "Waterlife s.c.",
  "ctaButtonPrimary": "Zobacz produkty",
  "ctaButtonSecondary": "Skontaktuj się"
}

Wydaje mi się, że to mało... w http://localhost:3000/admin/strona-glowna mam dużo więcej możliwości modyfikacji. Ogólnie - zastanawiam się czy to dobra praktyka, aby trzymać takie rzeczy w bazie? Czy nie w samym kodzie aplikacji i panelu admin

Use Case 11:
Usuń button "Przywróć domyślne" - niepotrzebne!

Use Case 12: Dashbaord http://localhost:3000/admin
Warto dodać / uzupełnić metryki danymi - teraz są same zera.

Use Case 13: Eksport listy produktów do CSV http://localhost:3000/admin/produkty
Nazwa pliku WaterLifeProductsExport_timestamp.csv

