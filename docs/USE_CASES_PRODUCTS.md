# Use Cases - Strona Produktow

Wymagania funkcjonalne dla strony produktow WaterLife.
Dotyczy: http://localhost:3000/produkty

---

## Use Case 1: Panel filtrowania
**Status: ZAIMPLEMENTOWANE**

Panel filtrowania po lewej stronie:
- a) Kategorie - ze slownika z panelu Admin
- b) Dropdown z producentem (multiselect, default: wszystkie)
- c) Cena - OD DO (bez suwaka, jak na Allegro)
- d) Dostepnosc

**Cel:** Ulatwienie wyszukiwania produktow przez klientow.

---

## Use Case 2: Paginacja produktow
**Status: ZAIMPLEMENTOWANE**

Renderowanie 12 produktow na strone z linkami do kolejnych 12.
(W sklepie moze byc kilkaset produktow)

**Cel:** Wydajnosc i UX przy duzej liczbie produktow.

---

## Use Case 3: Wyszukiwarka na stronie produktow
**Status: ZAIMPLEMENTOWANE**

Filtr/wyszukiwarka na prawo od opisu "Nasze produkty" - nad sekcja z kartami.
Uzytkownik wpisuje czego szuka, filtrowana jest sekcja z kartami produktow.

**Cel:** Szybkie wyszukiwanie produktow.

---

## Use Case 4: Dodawanie do koszyka
**Status: ZAIMPLEMENTOWANE**

Po kliknieciu "Dodaj do koszyka" pojawia sie modal z informacja o dodaniu.
Produkt faktycznie dodawany do koszyka.

**Cel:** Potwierdzenie akcji dla uzytkownika.

---

## Use Case 5: Oznaczenie Bestseller
**Status: ZAIMPLEMENTOWANE**

Checkbox "Bestseller" w panelu admin.
Tylko produkty oznaczone jako Bestseller wyswietlane na stronie glownej.
Max 6 produktow, sortowane po cenie (od najwyzszej).

**Cel:** Promocja najlepszych produktow na stronie glownej.
