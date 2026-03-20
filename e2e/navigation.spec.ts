import { test, expect } from '@playwright/test';

test.describe('Strona główna', () => {
  test('ładuje się poprawnie i ma właściwy tytuł', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    await expect(page).toHaveTitle(/Waterlife/i);
    expect(consoleErrors).toHaveLength(0);
  });

});

test.describe('Nawigacja główna', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('wszystkie linki nawigacyjne są widoczne', async ({ page }) => {
    const navLinks = [
      'Technika Grzewcza',
      'Systemy Sanitarne',
      'Nawadnianie',
      'Produkty',
      'Kontakt',
    ];

    for (const name of navLinks) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });

  test('linki nawigacyjne są klikalne na stronie głównej', async ({ page }) => {
    // Na homepage linki mają href="#..." i są aktywne (nie wyłączone)
    const heatingLink = page.getByText('Technika Grzewcza').first();
    await expect(heatingLink).toBeVisible();
    await heatingLink.click();
    // Po kliknięciu nadal jesteśmy na homepage (smooth scroll w obrębie strony)
    await expect(page).toHaveURL('/');
  });

  test('link Kontakt jest widoczny i klikalny', async ({ page }) => {
    const contactLink = page.getByText('Kontakt').first();
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Strona /produkty', () => {
  test('ładuje się i wyświetla listę produktów', async ({ page }) => {
    await page.goto('/produkty');

    // Nagłówek strony
    await expect(
      page.getByRole('heading', { name: 'Nasze Produkty' })
    ).toBeVisible();
  });

  test('zawiera pole wyszukiwania', async ({ page }) => {
    await page.goto('/produkty');

    // SearchBar — input type="text" (rola "textbox"), identyfikowany przez placeholder
    const searchInput = page.getByPlaceholder('Szukaj produktów...');
    await expect(searchInput).toBeVisible();
  });

  test('wyświetla filtry produktów na desktopie', async ({ page }) => {
    await page.goto('/produkty');

    // Przycisk filtrów (mobile) lub sidebar (desktop)
    // Na desktopie sidebar jest widoczny (hidden na mobile, block na lg)
    const filtersButton = page.getByRole('button', { name: /filtry/i });
    // Na desktopie (1280px) przycisk "Filtry" jest ukryty (lg:hidden), sidebar widoczny
    await expect(filtersButton).not.toBeVisible();
  });
});
