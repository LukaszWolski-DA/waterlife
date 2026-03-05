import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dostawa | Waterlife',
  description: 'Informacje o dostawie, czasie realizacji i kosztach wysyłki w Waterlife.',
};

export default function Dostawa() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Dostawa</h1>
      <p className="text-muted-foreground mb-8">Wszystko, co musisz wiedzieć o wysyłce zamówień.</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-3">Czas realizacji</h2>
          <p>
            Towar wysyłamy przeważnie w ciągu <strong>48 godzin roboczych</strong> (poniedziałek–piątek)
            od potwierdzenia zamówienia.
          </p>
          <p className="mt-2">
            W <strong>okresach świątecznych</strong> oraz od <strong>kwietnia do sierpnia</strong> czas
            realizacji może ulec lekkiemu wydłużeniu — poinformujemy Cię o tym przy potwierdzeniu zamówienia.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Metody dostawy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Kurier</strong> — dostawa pod wskazany adres, maks. waga paczki: 31,5 kg</li>
            <li><strong>Firma spedycyjna</strong> — dla zamówień gabarytowych lub o dużej wadze</li>
            <li><strong>Paczkomat</strong> — maks. waga paczki: 20 kg</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Limity wagowe i dodatkowe paczki</h2>
          <p>
            Towar przekraczający limit wagowy (31,5 kg kurier / 20 kg paczkomat) pakujemy do
            dodatkowych paczek. Koszt każdej dodatkowej paczki pokrywa Kupujący — ustalamy
            go indywidualnie przed wysyłką.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Kilka pozycji w jednym zamówieniu</h2>
          <p>
            Jeśli zamawiasz kilka produktów o różnych kosztach dostawy, a łączna waga nie
            przekracza 31,5 kg, wysyłamy je w jednej paczce po <strong>najwyższym koszcie
            transportu</strong> spośród zamówionych pozycji.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Pytania o dostawę?</h2>
          <p>
            Skontaktuj się z nami:{' '}
            <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">
              biuro@waterlife.net.pl
            </a>{' '}
            lub tel. 535-430-854 (pon.–pt. 9:00–15:00).
          </p>
        </section>

      </div>
    </div>
  );
}
