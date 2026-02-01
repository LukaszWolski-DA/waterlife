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
