import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { ClientInit } from '@/components/ClientInit'
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: 'Waterlife - Technika Grzewcza i Sanitarna',
  description: 'Waterlife - profesjonalne systemy grzewcze, sanitarne i nawadniające. Kotły gazowe, podgrzewacze wody, systemy nawadniania.',
  generator: 'v0.app',

  // Open Graph dla social sharing
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://waterlife.net.pl',
    siteName: 'Waterlife',
    title: 'Waterlife - Technika Grzewcza i Sanitarna',
    description: 'Profesjonalne systemy grzewcze, sanitarne i nawadniające.',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Waterlife - Technika Grzewcza i Sanitarna',
    description: 'Profesjonalne systemy grzewcze, sanitarne i nawadniające.',
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? 'https://waterlife.net.pl',
  },

  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClientInit />
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
