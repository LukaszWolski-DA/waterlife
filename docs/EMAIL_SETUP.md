# Konfiguracja powiadomień email z Resend

## 📋 Przegląd

System wysyła **dwa osobne emaile** po złożeniu zamówienia:
1. **Email dla klienta** - potwierdzenie zamówienia (przyjaźniejszy ton)
2. **Email dla biura** - powiadomienie o nowym zapytaniu ofertowym (ton formalny)

## 🚀 Szybki start

### Krok 1: Rejestracja w Resend

1. Przejdź na [https://resend.com](https://resend.com)
2. Załóż **darmowe konto** (100 maili/dzień)
3. Wejdź do zakładki **"API Keys"**
4. Kliknij **"Create API Key"**
5. Skopiuj wygenerowany klucz (zaczyna się od `re_`)

### Krok 2: Konfiguracja projektu

Otwórz plik `.env.local` w głównym folderze projektu i zaktualizuj następujące wartości:

```env
# Wklej swój klucz API z Resend
RESEND_API_KEY=re_twoj_klucz_api_tutaj

# Email nadawcy (na początku użyj testowego)
EMAIL_FROM=onboarding@resend.dev

# TESTY: Wpisz swój prywatny email - oba maile będą tu trafiać
EMAIL_OFFICE_TEST=twoj-prywatny-email@gmail.com
```

**Przykład:**
```env
RESEND_API_KEY=re_ABC123def456GHI789jkl012MNO345
EMAIL_FROM=onboarding@resend.dev
EMAIL_OFFICE_TEST=jan.kowalski@gmail.com
```

### Krok 3: Test

1. Uruchom serwer developerski: `npm run dev`
2. Przejdź na stronę zamówienia: `http://localhost:3000/koszyk`
3. Dodaj produkty do koszyka
4. Wypełnij formularz i złóż zamówienie
5. Sprawdź swoją skrzynkę email - powinieneś dostać **2 maile**:
   - Email potwierdzający dla klienta
   - Email powiadomienia dla biura

## 📊 Tryb testowy vs produkcyjny

### Tryb testowy (obecny)

**Konfiguracja:**
```env
EMAIL_OFFICE_TEST=twoj-prywatny-email@gmail.com
```

**Co się dzieje:**
- Email dla klienta → `twoj-prywatny-email@gmail.com`
- Email dla biura → `twoj-prywatny-email@gmail.com`
- Możesz testować oba szablony jednocześnie

### Tryb produkcyjny (później)

**Konfiguracja:**
```env
EMAIL_FROM=zamowienia@waterlife.net.pl
EMAIL_OFFICE=biuro@waterlife.net.pl
# Usuń lub zakomentuj EMAIL_OFFICE_TEST
```

**Co się dzieje:**
- Email dla klienta → adres email klienta z formularza
- Email dla biura → `biuro@waterlife.net.pl`

## 🔧 Weryfikacja domeny (produkcja)

Aby wysyłać maile z własnej domeny (np. `zamowienia@waterlife.net.pl`):

1. Zaloguj się do [Resend Dashboard](https://resend.com/domains)
2. Kliknij **"Add Domain"**
3. Wpisz swoją domenę: `waterlife.net.pl`
4. Dodaj rekordy DNS (SPF, DKIM, DMARC) w panelu swojego hostingu
5. Poczekaj na weryfikację (zazwyczaj 5-15 minut)
6. Zmień `EMAIL_FROM` w `.env.local`:
   ```env
   EMAIL_FROM=zamowienia@waterlife.net.pl
   ```

## 📧 Szablony emaili

### Szablon dla klienta
- **Lokalizacja:** `lib/email.ts` → `sendCustomerOrderConfirmationEmail()`
- **Styl:** Przyjaźniejszy, customer-facing
- **Zawiera:** Potwierdzenie, numer zamówienia, produkty, informacje o kolejnych krokach
- **Temat:** `Potwierdzenie zamówienia #ABC12345`

### Szablon dla biura
- **Lokalizacja:** `lib/email.ts` → `sendOfficeOrderNotificationEmail()`
- **Styl:** Formalny, biznesowy
- **Zawiera:** Wszystkie dane klienta, produkty, uwagi, akcja wymagana
- **Temat:** `🔔 Nowe zapytanie ofertowe - Jan Kowalski`

## 🐛 Rozwiązywanie problemów

### "Error: Missing API Key"
- Sprawdź czy `RESEND_API_KEY` jest ustawiony w `.env.local`
- Upewnij się że klucz zaczyna się od `re_`
- Zrestartuj serwer developerski po zmianie `.env.local`

### Maile nie przychodzą
- Sprawdź folder SPAM/Promocje
- Sprawdź logi w konsoli serwera - szukaj `✅ Email wysłany`
- Sprawdź [Resend Dashboard](https://resend.com/emails) - wszystkie wysyłki są tam logowane

### Email przychodzi tylko jeden
- Sprawdź logi konsoli - powinny być dwa komunikaty:
  - `✅ Email do klienta wysłany pomyślnie`
  - `✅ Email do biura wysłany pomyślnie`
- Jeśli jeden zawodzi, sprawdź szczegóły błędu w konsoli

### "Invalid recipient email"
- W trybie testowym: sprawdź czy `EMAIL_OFFICE_TEST` zawiera prawidłowy adres email
- Upewnij się że nie ma spacji ani literówek

## 📊 Monitoring

### Konsola serwera
Po wysłaniu zamówienia zobaczysz:
```
✅ Order saved to database: abc-123-def-456
✅ Email do klienta wysłany pomyślnie: email_id_1
   → Odbiorca: twoj-email@gmail.com
✅ Email do biura wysłany pomyślnie: email_id_2
   → Odbiorca: twoj-email@gmail.com
✅ Oba emaile wysłane pomyślnie
```

### Resend Dashboard
1. Zaloguj się na [resend.com](https://resend.com)
2. Przejdź do zakładki **"Emails"**
3. Zobaczysz listę wszystkich wysłanych maili
4. Możesz sprawdzić status: `delivered`, `bounced`, `complained`
5. Możesz podejrzeć treść wysłanego emaila

## 🎯 Limity

### Darmowy plan Resend:
- **100 maili dziennie**
- **1 zweryfikowana domena**
- Wszystkie funkcje dostępne

To wystarczy na:
- ~50 zamówień dziennie (2 maile na zamówienie)
- Pełne testowanie aplikacji
- Początkowy ruch produkcyjny

### Upgrade (jeśli potrzebny):
- Plan **PRO**: $20/miesiąc - 50,000 maili/miesiąc
- Plan **BUSINESS**: od $80/miesiąc - 500,000 maili/miesiąc

## 🔐 Bezpieczeństwo

- ✅ Klucz API jest w `.env.local` (nie trafia do Git)
- ✅ Plik `.env.local` jest w `.gitignore`
- ✅ Nigdy nie commituj pliku `.env.local` do repozytorium
- ✅ Na produkcji użyj zmiennych środowiskowych na serwerze

## 📞 Pomoc

Jeśli masz problemy:
1. Sprawdź [Dokumentację Resend](https://resend.com/docs)
2. Sprawdź logi w konsoli serwera
3. Sprawdź status w Resend Dashboard
4. Sprawdź folder SPAM

## ✅ Checklist przed produkcją

- [ ] Klucz API Resend jest poprawny
- [ ] Domena została zweryfikowana w Resend
- [ ] `EMAIL_FROM` ustawiony na `zamowienia@waterlife.net.pl`
- [ ] `EMAIL_OFFICE` ustawiony na `biuro@waterlife.net.pl`
- [ ] `EMAIL_OFFICE_TEST` usunięty lub zakomentowany
- [ ] Przetestowano wysyłkę na produkcji (testowe zamówienie)
- [ ] Sprawdzono czy maile nie lądują w SPAM
- [ ] Zweryfikowano treść obu emaili
- [ ] Sprawdzono responsywność emaili na różnych urządzeniach
