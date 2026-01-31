import ContactForm from '@/components/forms/ContactForm';

/**
 * Strona kontaktowa z formularzem
 * Umożliwia wysłanie wiadomości z możliwością załączenia pliku
 */
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Skontaktuj się z nami</h1>
        <p className="text-gray-600 mb-8">
          Masz pytania? Wypełnij formularz, a odpowiemy tak szybko, jak to możliwe.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <ContactForm />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p className="text-gray-600">kontakt@waterlife.pl</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Telefon</h3>
            <p className="text-gray-600">+48 123 456 789</p>
          </div>
        </div>
      </div>
    </div>
  );
}
