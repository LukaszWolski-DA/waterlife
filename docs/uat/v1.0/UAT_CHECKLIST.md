# WaterLife — UAT Checklist

| | |
|---|---|
| **Projekt** | WaterLife — Technika Grzewcza i Systemy Nawadniające |
| **Wersja dokumentu** | v1.0 |
| **Data** | 2026-06-13 |
| **URL aplikacji** | https://waterlife.net.pl |
| **Status** | 🟡 W toku |

---

## Jak korzystać z dokumentu

1. Przejdź przez każdy punkt w kolejności.
2. Dla każdego testu zaznacz wynik: **OK**, **Błąd** lub **N/D** (nie dotyczy).
3. W kolumnie **Komentarz** wpisz uwagi jeśli coś nie działa lub wygląda inaczej niż oczekiwano.
4. Po zakończeniu testów przejdź do sekcji **Podpisanie odbioru** na końcu dokumentu.

**Legenda tagów:**

| Tag | Znaczenie |
|-----|-----------|
| `[NOWY]` | Test pojawia się po raz pierwszy w tej wersji |
| `[RE-TEST]` | Poprzednio zgłoszony błąd — wymaga ponownej weryfikacji |
| `[ZMIENIONY]` | Funkcjonalność została zmodyfikowana |

---

## Dane testowe

| Element | Wartość |
|---------|---------|
| **URL aplikacji** | https://waterlife.net.pl |
| **Login admina** | admin@waterlife.net.pl |
| **Hasło admina** | *(przekazane osobno)* |
| **Produkty testowe** | Dostępne w katalogu — wybierz dowolny |
| **Konto testowe** | Zarejestruj nowe podczas testu HP-17 |

---

<div style="page-break-before: always;"></div>

## Moduł 1: Strona publiczna

### HP-01 `[NOWY]` Ładowanie strony głównej

**Cel:** Strona otwiera się poprawnie i wyświetla wszystkie główne elementy.

**Kroki:**
1. Otwórz https://waterlife.net.pl w przeglądarce
2. Sprawdź czy strona załadowała się w całości (brak komunikatów o błędach)
3. Sprawdź czy widoczne jest logo WaterLife w nagłówku
4. Sprawdź czy widoczny jest numer telefonu w nagłówku

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-01_ladowanie.png`

![](screenshots/homepage/HP-01_ladowanie.png)

---

### HP-02 `[NOWY]` Strona główna — sekcja Hero

**Cel:** Główny baner strony wyświetla się z poprawną treścią i przyciskami.

**Kroki:**
1. Na stronie głównej sprawdź widoczność sekcji Hero (górna część strony)
2. Sprawdź czy widoczny jest tytuł firmy i slogan
3. Kliknij przycisk CTA (np. "Zobacz ofertę" lub "Kontakt")
4. Sprawdź czy przycisk przenosi do właściwej sekcji

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-02_hero.png`

![](screenshots/homepage/HP-02_hero.png)

---

### HP-03 `[NOWY]` Strona główna — sekcja oferty

**Cel:** Sekcja z ofertą/produktami wyświetla się poprawnie.

**Kroki:**
1. Przewiń stronę główną w dół do sekcji oferty
2. Sprawdź czy widoczne są kafelki/karty produktów lub kategorii
3. Kliknij w jeden z elementów i sprawdź czy przenosi do właściwej podstrony

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-03_oferta.png`

![](screenshots/homepage/HP-03_oferta.png)

---

### HP-04 `[NOWY]` Strona główna — sekcja kontaktowa

**Cel:** Dane kontaktowe firmy są widoczne i poprawne.

**Kroki:**
1. Przewiń stronę główną do sekcji kontaktowej
2. Sprawdź czy widoczny jest adres, telefon i email firmy
3. Sprawdź czy link do Facebooka jest widoczny i klikalny
4. Kliknij w Facebook — powinien otworzyć się nowa zakładka z profilem WaterLife

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-04_kontakt_sekcja.png`

![](screenshots/homepage/HP-04_kontakt_sekcja.png)

---

### HP-05 `[NOWY]` Nawigacja — menu desktop

**Cel:** Menu nawigacyjne działa poprawnie na komputerze.

**Kroki:**
1. Na szerokości ekranu komputera sprawdź menu nawigacyjne w nagłówku
2. Kliknij kolejno każdą pozycję menu
3. Sprawdź czy każda pozycja przenosi do właściwej podstrony
4. Kliknij logo WaterLife — powinno przenieść na stronę główną

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-05_menu_desktop.png`

![](screenshots/homepage/HP-05_menu_desktop.png)

---

### HP-06 `[NOWY]` Nawigacja — menu mobilne

**Cel:** Menu hamburger działa na urządzeniach mobilnych.

**Kroki:**
1. Zmniejsz okno przeglądarki do szerokości telefonu (lub użyj trybu mobilnego w DevTools)
2. Sprawdź czy pojawia się ikona hamburger (☰) zamiast menu
3. Kliknij ikonę — menu powinno się rozwinąć
4. Kliknij dowolną pozycję — menu powinno się zamknąć i przenieść na właściwą stronę

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-06_menu_mobile.png`

![](screenshots/homepage/HP-06_menu_mobile.png)

---

### HP-07 `[NOWY]` Link do Facebooka — nagłówek

**Cel:** Link do Facebooka w nagłówku strony działa poprawnie.

**Kroki:**
1. W nagłówku strony znajdź ikonę Facebooka
2. Kliknij ikonę
3. Sprawdź czy otwiera się właściwy profil WaterLife na Facebooku w nowej zakładce

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-08 `[NOWY]` Lista produktów — przeglądanie

**Cel:** Katalog produktów wyświetla się poprawnie.

**Kroki:**
1. Przejdź do sekcji Produkty
2. Sprawdź czy lista produktów jest widoczna (zdjęcia, nazwy, ceny)
3. Sprawdź czy produkty wyświetlają się w formie siatki
4. Przewiń listę — sprawdź czy wszystkie produkty ładują się poprawnie

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-08_lista_produktow.png`

![](screenshots/homepage/HP-08_lista_produktow.png)

---

### HP-09 `[NOWY]` Szczegóły produktu

**Cel:** Strona produktu wyświetla pełne informacje.

**Kroki:**
1. Na liście produktów kliknij w wybrany produkt
2. Sprawdź czy widoczna jest nazwa produktu, opis i cena
3. Sprawdź czy wyświetla się zdjęcie produktu
4. Sprawdź czy widoczny jest przycisk "Dodaj do koszyka"

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-09_szczegoly_produktu.png`

![](screenshots/homepage/HP-09_szczegoly_produktu.png)

---

### HP-10 `[NOWY]` Specyfikacja techniczna produktu

**Cel:** Tabela specyfikacji technicznej jest widoczna i czytelna.

**Kroki:**
1. Na stronie produktu przewiń w dół do sekcji specyfikacji technicznej
2. Sprawdź czy tabela z parametrami jest widoczna
3. Sprawdź czy dane w tabeli są czytelne i sformatowane poprawnie

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-10_specyfikacja.png`

![](screenshots/homepage/HP-10_specyfikacja.png)

---

### HP-11 `[NOWY]` Dodanie produktu do koszyka

**Cel:** Produkt można dodać do koszyka.

**Kroki:**
1. Na stronie produktu kliknij "Dodaj do koszyka"
2. Sprawdź czy pojawia się komunikat potwierdzający dodanie
3. Sprawdź czy licznik koszyka w nagłówku zaktualizował się
4. Dodaj ten sam produkt ponownie — liczba sztuk powinna wzrosnąć

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-12 `[NOWY]` Koszyk — zarządzanie produktami

**Cel:** Koszyk pozwala na zmianę ilości i usunięcie produktów.

**Kroki:**
1. Przejdź do koszyka (ikona koszyka w nagłówku)
2. Sprawdź czy dodane produkty są widoczne z nazwą, ceną i ilością
3. Zmień ilość jednego produktu — suma powinna się zaktualizować
4. Usuń jeden produkt z koszyka — powinien zniknąć z listy
5. Sprawdź czy widoczna jest suma całkowita

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-12_koszyk.png`

![](screenshots/homepage/HP-12_koszyk.png)

---

### HP-13 `[NOWY]` Formularz zapytania ofertowego — gość

**Cel:** Niezalogowany użytkownik może wysłać zapytanie ofertowe.

**Kroki:**
1. Mając produkty w koszyku, przejdź do formularza zapytania
2. Wypełnij formularz: imię, nazwisko, email, telefon
3. Kliknij "Wyślij zapytanie ofertowe"
4. Sprawdź czy pojawia się komunikat o pomyślnym wysłaniu

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-13_formularz_zapytanie.png`

![](screenshots/homepage/HP-13_formularz_zapytanie.png)

---

### HP-14 `[NOWY]` Email potwierdzający — klient

**Cel:** Klient otrzymuje email z potwierdzeniem zapytania.

**Kroki:**
1. Po wysłaniu zapytania (HP-13) sprawdź skrzynkę email podaną w formularzu
2. Sprawdź czy przyszedł email z potwierdzeniem od WaterLife
3. Sprawdź czy email zawiera szczegóły zamówienia (produkty, ceny, dane kontaktowe)

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-14_email_klient.png`

![](screenshots/homepage/HP-14_email_klient.png)

---

### HP-15 `[NOWY]` Email powiadomienie — biuro

**Cel:** Biuro WaterLife otrzymuje powiadomienie o nowym zapytaniu.

**Kroki:**
1. Sprawdź skrzynkę sklep@waterlife.net.pl
2. Sprawdź czy przyszedł email z informacją o nowym zapytaniu
3. Sprawdź czy email zawiera dane klienta i listę produktów

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-16 `[NOWY]` Formularz kontaktowy

**Cel:** Formularz kontaktowy działa poprawnie.

**Kroki:**
1. Przejdź do strony Kontakt
2. Wypełnij formularz: imię i nazwisko, email, wiadomość
3. Kliknij "Wyślij"
4. Sprawdź czy pojawia się komunikat o pomyślnym wysłaniu

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-16_formularz_kontakt.png`

![](screenshots/homepage/HP-16_formularz_kontakt.png)

---

### HP-17 `[NOWY]` Rejestracja nowego konta

**Cel:** Nowy użytkownik może założyć konto.

**Kroki:**
1. Przejdź do strony rejestracji
2. Wypełnij formularz danymi testowymi (nowy email, hasło)
3. Kliknij "Zarejestruj się"
4. Sprawdź czy pojawia się komunikat o pomyślnej rejestracji lub przekierowanie

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-18 `[NOWY]` Logowanie na konto

**Cel:** Zarejestrowany użytkownik może się zalogować.

**Kroki:**
1. Przejdź do strony logowania
2. Wpisz email i hasło z rejestracji (HP-17)
3. Kliknij "Zaloguj się"
4. Sprawdź czy nastąpiło przekierowanie i czy w nagłówku widoczna jest informacja o zalogowaniu

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-19 `[NOWY]` Profil użytkownika

**Cel:** Zalogowany użytkownik może przeglądać i edytować swój profil.

**Kroki:**
1. Będąc zalogowanym, przejdź do profilu użytkownika
2. Sprawdź czy widoczne są dane konta
3. Zmień jedno pole (np. numer telefonu) i zapisz
4. Odśwież stronę — sprawdź czy zmiana została zapisana

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-20 `[NOWY]` Formularz zapytania — zalogowany użytkownik

**Cel:** Formularz zapytania autouzupełnia dane zalogowanego użytkownika.

**Kroki:**
1. Będąc zalogowanym, dodaj produkt do koszyka
2. Przejdź do formularza zapytania
3. Sprawdź czy pola imię, nazwisko, email i telefon są automatycznie wypełnione
4. Wyślij zapytanie i sprawdź czy zakończyło się sukcesem

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-21 `[NOWY]` Wylogowanie

**Cel:** Użytkownik może się wylogować.

**Kroki:**
1. Będąc zalogowanym, znajdź opcję wylogowania
2. Kliknij "Wyloguj"
3. Sprawdź czy nastąpiło wylogowanie i przekierowanie na stronę główną
4. Sprawdź czy dostęp do profilu jest zablokowany po wylogowaniu

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### HP-22 `[NOWY]` Responsywność — mobile i tablet

**Cel:** Strona wyświetla się poprawnie na urządzeniach mobilnych.

**Kroki:**
1. Otwórz stronę na telefonie (lub zmniejsz okno przeglądarki)
2. Sprawdź stronę główną — treść nie powinna wychodzić poza ekran
3. Sprawdź listę produktów — układ powinien być kolumnowy
4. Sprawdź formularz zapytania — pola powinny być wygodne do kliknięcia

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/homepage/HP-22_mobile.png`

![](screenshots/homepage/HP-22_mobile.png)

---

<div style="page-break-before: always;"></div>

## Moduł 2: Panel administratora

> **Dostęp:** https://waterlife.net.pl/admin &nbsp;|&nbsp; Login: admin@waterlife.net.pl

---

### AP-01 `[NOWY]` Logowanie do panelu admina

**Cel:** Administrator może zalogować się do panelu.

**Kroki:**
1. Przejdź do https://waterlife.net.pl/admin
2. Wpisz email i hasło administratora
3. Kliknij "Zaloguj się"
4. Sprawdź czy nastąpiło przekierowanie do panelu admina

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/admin/AP-01_logowanie.png`

![](screenshots/admin/AP-01_logowanie.png)

---

### AP-02 `[NOWY]` Ochrona dostępu do panelu

**Cel:** Panel admina jest niedostępny dla niezalogowanych użytkowników.

**Kroki:**
1. Wyloguj się z panelu admina (lub otwórz okno prywatne)
2. Wpisz bezpośrednio adres https://waterlife.net.pl/admin
3. Sprawdź czy następuje przekierowanie do strony logowania
4. Sprawdź czy próba wejścia na /admin/produkty bez zalogowania również blokuje dostęp

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-03 `[NOWY]` Strona główna — edycja sekcji Hero

**Cel:** Administrator może edytować treść sekcji Hero strony głównej.

**Kroki:**
1. W panelu admina przejdź do zarządzania stroną główną
2. Zmień tytuł lub opis w sekcji Hero
3. Zapisz zmiany
4. Przejdź na stronę główną i sprawdź czy zmiany są widoczne

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/admin/AP-03_hero_edycja.png`

![](screenshots/admin/AP-03_hero_edycja.png)

---

### AP-04 `[NOWY]` Strona główna — edycja danych kontaktowych

**Cel:** Administrator może zaktualizować dane kontaktowe firmy.

**Kroki:**
1. W panelu admina przejdź do sekcji danych kontaktowych
2. Zmień np. numer telefonu lub adres email
3. Zapisz zmiany
4. Sprawdź na stronie głównej czy dane się zaktualizowały

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-05 `[NOWY]` Produkty — lista

**Cel:** Administrator widzi listę wszystkich produktów.

**Kroki:**
1. W panelu admina przejdź do sekcji Produkty
2. Sprawdź czy wyświetla się lista produktów z nazwą, ceną i statusem
3. Sprawdź czy widoczne są przyciski edycji i usunięcia przy każdym produkcie

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/admin/AP-05_produkty_lista.png`

![](screenshots/admin/AP-05_produkty_lista.png)

---

### AP-06 `[NOWY]` Produkty — dodanie nowego produktu

**Cel:** Administrator może dodać nowy produkt do katalogu.

**Kroki:**
1. W panelu produktów kliknij "Dodaj produkt"
2. Wypełnij formularz: nazwa, opis, cena, kategoria
3. Kliknij "Zapisz"
4. Sprawdź czy nowy produkt pojawił się na liście i w katalogu na stronie publicznej

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-07 `[NOWY]` Produkty — edycja produktu

**Cel:** Administrator może edytować istniejący produkt.

**Kroki:**
1. Na liście produktów kliknij edycję wybranego produktu
2. Zmień nazwę lub cenę
3. Zapisz zmiany
4. Sprawdź czy zmiany są widoczne na stronie produktu

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-08 `[NOWY]` Produkty — upload zdjęcia

**Cel:** Administrator może dodać lub zmienić zdjęcie produktu.

**Kroki:**
1. Wejdź w edycję wybranego produktu
2. Kliknij w obszar uploadu zdjęcia
3. Wybierz plik graficzny z dysku (JPG lub PNG)
4. Zapisz produkt i sprawdź czy nowe zdjęcie wyświetla się na stronie produktu

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-09 `[NOWY]` Produkty — usunięcie produktu

**Cel:** Administrator może usunąć produkt z katalogu.

**Kroki:**
1. Na liście produktów kliknij "Usuń" przy produkcie dodanym w teście AP-06
2. Potwierdź usunięcie w oknie dialogowym
3. Sprawdź czy produkt zniknął z listy w panelu admina
4. Sprawdź czy produkt zniknął z katalogu na stronie publicznej

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-10 `[NOWY]` Kategorie — zarządzanie

**Cel:** Administrator może zarządzać kategoriami produktów.

**Kroki:**
1. W panelu admina przejdź do sekcji Kategorie
2. Dodaj nową kategorię testową
3. Sprawdź czy kategoria jest dostępna przy dodawaniu produktu
4. Usuń testową kategorię

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-11 `[NOWY]` Producenci — zarządzanie

**Cel:** Administrator może zarządzać listą producentów.

**Kroki:**
1. W panelu admina przejdź do sekcji Producenci
2. Dodaj nowego producenta testowego
3. Sprawdź czy producent jest dostępny przy dodawaniu produktu
4. Usuń testowego producenta

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

### AP-12 `[NOWY]` Zamówienia — lista zapytań

**Cel:** Administrator widzi listę wszystkich zapytań ofertowych.

**Kroki:**
1. W panelu admina przejdź do sekcji Zamówienia
2. Sprawdź czy widoczna jest lista zapytań z datą, danymi klienta i statusem
3. Sprawdź czy widoczne jest zapytanie wysłane podczas testu HP-13

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/admin/AP-12_zamowienia_lista.png`

![](screenshots/admin/AP-12_zamowienia_lista.png)

---

### AP-13 `[NOWY]` Zamówienia — szczegóły zapytania

**Cel:** Administrator może podejrzeć szczegóły zapytania ofertowego.

**Kroki:**
1. Na liście zamówień kliknij w wybrany rekord
2. Sprawdź czy widoczne są: dane klienta, lista produktów, wartość, data
3. Sprawdź czy dane zgadzają się z zapytaniem wysłanym w teście HP-13

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/admin/AP-13_zamowienie_szczegoly.png`

![](screenshots/admin/AP-13_zamowienie_szczegoly.png)

---

### AP-14 `[NOWY]` Wiadomości z formularza kontaktowego

**Cel:** Administrator widzi wiadomości wysłane przez formularz kontaktowy.

**Kroki:**
1. W panelu admina przejdź do sekcji Wiadomości / Kontakt
2. Sprawdź czy widoczna jest wiadomość wysłana podczas testu HP-16
3. Sprawdź czy widoczne są dane nadawcy i treść wiadomości

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

> 📸 Zapisz screenshot jako: `screenshots/admin/AP-14_wiadomosci.png`

![](screenshots/admin/AP-14_wiadomosci.png)

---

### AP-15 `[NOWY]` Wylogowanie z panelu admina

**Cel:** Administrator może bezpiecznie wylogować się z panelu.

**Kroki:**
1. W panelu admina znajdź opcję wylogowania
2. Kliknij "Wyloguj"
3. Sprawdź czy nastąpiło przekierowanie poza panel admina
4. Sprawdź czy próba wejścia na /admin bez zalogowania ponownie blokuje dostęp

| Wynik | Komentarz |
|-------|-----------|
| ☐ OK &nbsp;&nbsp; ☐ Błąd &nbsp;&nbsp; ☐ N/D | |

---

<div style="page-break-before: always;"></div>

## Podsumowanie testów

| | Strona publiczna (HP) | Panel admina (AP) | Łącznie |
|---|---|---|---|
| **Liczba testów** | 22 | 15 | 37 |
| **OK** | | | |
| **Błąd** | | | |
| **N/D** | | | |

**Uwagi ogólne:**

&nbsp;

&nbsp;

&nbsp;

---

<div style="page-break-before: always;"></div>

## Podpisanie odbioru

Niniejszym potwierdzam, że przeprowadziłem/am testy aplikacji WaterLife zgodnie z powyższą checklistą i akceptuję jej stan na dzień podpisania.

&nbsp;

| | |
|---|---|
| **Projekt** | WaterLife — Technika Grzewcza i Systemy Nawadniające |
| **Wersja UAT** | v1.0 |
| **Data testów** | &nbsp; |
| **Wynik ogólny** | ☐ Zaakceptowano &nbsp;&nbsp; ☐ Zaakceptowano z uwagami &nbsp;&nbsp; ☐ Odrzucono |

&nbsp;

**Uwagi do odbioru:**

&nbsp;

&nbsp;

&nbsp;

---

**Klient:**

Imię i nazwisko: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Podpis / data: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&nbsp;

**Wykonawca:**

Imię i nazwisko: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Podpis / data: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
