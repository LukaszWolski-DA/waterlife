import ProductForm from '@/components/produkty/ProductForm';

/**
 * Strona dodawania nowego produktu
 * Zawiera formularz z polami: nazwa, opis, cena, zdjęcia, kategoria, stan magazynowy
 */
export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dodaj nowy produkt</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
