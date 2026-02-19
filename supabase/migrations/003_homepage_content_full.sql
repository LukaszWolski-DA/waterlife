-- Migration: Populate homepage_content with full structure
-- Migracja: Uzupełnienie homepage_content pełną strukturą danych
-- Author: Migration from localStorage to Supabase
-- Date: 2026-02-04

-- Najpierw usuń stare dane (jeśli istnieją)
DELETE FROM homepage_content WHERE section IN ('hero', 'homepage');

-- Wstaw pełną strukturę homepage jako jeden rekord
INSERT INTO homepage_content (section, content)
VALUES (
  'homepage',
  '{
    "hero": {
      "companyName": "Waterlife s.c.",
      "mainTitle": "Profesjonalna technika grzewcza i sanitarna",
      "subtitle": "Oferujemy kompleksowe rozwiązania dla instalacji grzewczych, sanitarnych oraz systemów nawadniających. Ponad 420 produktów najwyższej jakości.",
      "ctaButtonPrimary": "Przejdź do sklepu",
      "ctaButtonSecondary": "Skontaktuj się",
      "benefits": [
        {
          "title": "Szybka dostawa",
          "description": "Na terenie całej Polski"
        },
        {
          "title": "Gwarancja jakości",
          "description": "Sprawdzeni producenci"
        },
        {
          "title": "Wsparcie techniczne",
          "description": "Doradztwo przy wyborze"
        }
      ]
    },
    "stats": [
      {
        "value": "420+",
        "label": "Produktów w ofercie"
      },
      {
        "value": "15+",
        "label": "Lat doświadczenia"
      },
      {
        "value": "98%",
        "label": "Zadowolonych klientów"
      },
      {
        "value": "24h",
        "label": "Czas realizacji"
      }
    ],
    "contact": {
      "sectionLabel": "Skontaktuj się z nami",
      "title": "Porozmawiajmy o Twoim projekcie",
      "description": "Nasi specjaliści pomogą Ci dobrać odpowiednie rozwiązania dla Twojego domu lub firmy. Skontaktuj się z nami, a odpowiemy na wszystkie pytania.",
      "phone": "535-430-854",
      "phoneLink": "tel:+48535430854",
      "email": "biuro@waterlife.net.pl",
      "emailLink": "mailto:biuro@waterlife.net.pl",
      "address": "Oborniki Śląskie, Polska",
      "addressLink": "https://www.google.com/maps/place/Waterlife+s.c.+-+Technika+grzewcza+i+sanitarna,+instalacje+zewn%C4%99trzne,+systemy+nawadniaj%C4%85ce/@51.285607,16.9215649,1923m/data=!3m1!1e3!4m6!3m5!1s0x470f939d078a3731:0x660a10ce6c9d7b65!8m2!3d51.2907175!4d16.9110073!16s%2Fg%2F11shx62khf",
      "workingHours": "Pon-Pt: 8:00 - 16:00",
      "formTitle": "Wyślij wiadomość",
      "formButtonText": "Wyślij wiadomość"
    },
    "categoriesIntro": {
      "sectionLabel": "Nasze kategorie",
      "title": "Kompleksowe rozwiązania dla Twojego domu",
      "description": "Znajdź wszystko, czego potrzebujesz do instalacji grzewczej, sanitarnej i nawadniającej w jednym miejscu."
    },
    "categoryCards": [
      {
        "title": "Technika Grzewcza",
        "description": "Kotły gazowe, nagrzewnice, pompy ciepła i akcesoria grzewcze od najlepszych producentów.",
        "productCount": "180+ produktów",
        "image": "/images/category-heating.jpg"
      },
      {
        "title": "Systemy Sanitarne",
        "description": "Podgrzewacze wody, zawory, pompy i kompletne systemy do instalacji wodno-kanalizacyjnych.",
        "productCount": "150+ produktów",
        "image": "/images/category-sanitary.jpg"
      },
      {
        "title": "Nawadnianie",
        "description": "Profesjonalne systemy nawadniające, elektrozawory, sterowniki i akcesoria do ogrodu.",
        "productCount": "90+ produktów",
        "image": "/images/category-irrigation.jpg"
      }
    ],
    "brands": {
      "sectionLabel": "Współpracujemy z najlepszymi producentami",
      "brands": [
        {
          "name": "TERMET",
          "url": "https://termet.pl"
        },
        {
          "name": "BOSCH",
          "url": "https://www.bosch.pl"
        },
        {
          "name": "Atlantic",
          "url": "https://www.atlantic.pl"
        },
        {
          "name": "VTS",
          "url": "https://vtsgroup.com"
        },
        {
          "name": "FLOWAIR",
          "url": "https://flowair.com"
        },
        {
          "name": "DANFOSS",
          "url": "https://www.danfoss.com"
        },
        {
          "name": "IMMERGAS",
          "url": "https://immergas.com"
        },
        {
          "name": "LG",
          "url": "https://www.lg.com/pl"
        }
      ]
    }
  }'::jsonb
)
ON CONFLICT (section) 
DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = NOW();

-- Sprawdź czy RLS policies są ustawione poprawnie
-- Public SELECT (strona główna musi czytać)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'homepage_content' 
    AND policyname = 'Allow public read access to homepage content'
  ) THEN
    CREATE POLICY "Allow public read access to homepage content"
      ON homepage_content
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Admin UPDATE (tylko admin może edytować)
-- TODO: Dodać sprawdzenie czy user jest adminem
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'homepage_content' 
    AND policyname = 'Allow authenticated users to update homepage content'
  ) THEN
    CREATE POLICY "Allow authenticated users to update homepage content"
      ON homepage_content
      FOR UPDATE
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Włącz RLS jeśli nie jest włączone
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Komentarz: Success message
COMMENT ON TABLE homepage_content IS 'Przechowuje edytowalne treści strony głównej. Sekcja "homepage" zawiera pełną strukturę w formacie JSON.';
