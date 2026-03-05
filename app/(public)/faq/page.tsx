import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ – Często zadawane pytania | Waterlife',
  description: 'Odpowiedzi na najczęściej zadawane pytania dotyczące serwisu Waterlife.',
};

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'Jak złożyć zapytanie ofertowe?',
    answer: (
      <>
        Dodaj interesujące Cię produkty do koszyka, a następnie wypełnij formularz z danymi
        kontaktowymi i wyślij zapytanie. Nasz zespół skontaktuje się z Tobą, aby ustalić
        szczegóły i przesłać indywidualną wycenę.
      </>
    ),
  },
  {
    question: 'Czy muszę zakładać konto, żeby złożyć zapytanie?',
    answer: (
      <>
        Nie — zapytania ofertowe można składać jako gość, bez rejestracji. Konto daje jednak
        dodatkowe możliwości: historię złożonych zapytań, szybsze wypełnianie formularzy i
        zarządzanie danymi firmy.
      </>
    ),
  },
  {
    question: 'Jak długo czeka się na odpowiedź?',
    answer: (
      <>
        Staramy się odpowiadać na każde zapytanie w ciągu jednego dnia roboczego
        (poniedziałek–piątek, 9:00–15:00). W przypadku bardziej złożonych wycen czas
        odpowiedzi może być nieco dłuższy — poinformujemy Cię o tym.
      </>
    ),
  },
  {
    question: 'Czy ceny widoczne na stronie są ostateczne?',
    answer: (
      <>
        Ceny produktów w katalogu mają charakter <strong>orientacyjny</strong>. Ostateczna
        cena ustalana jest indywidualnie na podstawie złożonego zapytania ofertowego, ilości
        produktów i warunków dostawy.
      </>
    ),
  },
  {
    question: 'Jak śledzić swoje zapytania i zamówienia?',
    answer: (
      <>
        Po zalogowaniu na konto możesz przeglądać historię złożonych zapytań ofertowych w
        sekcji <strong>Moje zamówienia</strong>. Statusy i wszelkie aktualizacje przesyłamy
        również na podany adres e-mail.
      </>
    ),
  },
  {
    question: 'Jakie kategorie produktów są dostępne?',
    answer: (
      <>
        Oferujemy produkty z trzech głównych kategorii:{' '}
        <a href="/produkty?categories=Nawadnianie" className="text-primary underline">Nawadnianie</a>,{' '}
        <a href="/produkty?categories=Technika%20Grzewcza" className="text-primary underline">Technika grzewcza</a>{' '}
        oraz{' '}
        <a href="/produkty?categories=Systemy%20Sanitarne" className="text-primary underline">Systemy sanitarne</a>.
        Pełny katalog znajdziesz w zakładce <a href="/produkty" className="text-primary underline">Produkty</a>.
      </>
    ),
  },
  {
    question: 'Jak się z Wami skontaktować?',
    answer: (
      <>
        Możesz napisać na{' '}
        <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">
          biuro@waterlife.net.pl
        </a>
        , zadzwonić pod numer <strong>535-430-854</strong> lub skorzystać z{' '}
        <a href="/#contact" className="text-primary underline">formularza kontaktowego</a>{' '}
        na stronie głównej. Pracujemy od poniedziałku do piątku w godzinach 9:00–15:00.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Często zadawane pytania</h1>
      <p className="text-muted-foreground mb-8">Masz pytanie? Sprawdź, czy już na nie odpowiedzieliśmy.</p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">{faq.question}</h2>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-muted rounded-lg">
        <p className="font-medium mb-1">Nie znalazłeś odpowiedzi?</p>
        <p className="text-muted-foreground text-sm">
          Napisz do nas na{' '}
          <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">
            biuro@waterlife.net.pl
          </a>{' '}
          lub zadzwoń: 535-430-854 (pon.–pt. 9:00–15:00).
        </p>
      </div>
    </div>
  );
}
