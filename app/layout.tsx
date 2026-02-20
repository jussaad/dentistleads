import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dentist Lead Generation Demo 2026 | Live Dashboard',
  description: 'Live demo of a dentist lead generation system tracking 247 leads, 18 appointments, and $47k revenue in real-time. Built for dental practices.',
  keywords: 'dentist lead generation demo 2026, dental leads dashboard, dental practice marketing',
  openGraph: {
    title: 'Dentist Lead Generation Demo 2026 | Live Dashboard',
    description: 'Live demo of a dentist lead generation system tracking 247 leads, 18 appointments, and $47k revenue in real-time. Built for dental practices.',
    type: 'website',
    url: 'https://dentistleads.pro', // Replace with your actual URL
    siteName: 'DentistLeads.pro',
    images: [
      {
        url: '/og-image.png', // Replace with your actual image path
        width: 1200,
        height: 630,
        alt: 'DentistLeads.pro Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dentist Lead Generation Demo 2026 | Live Dashboard',
    description: 'Live demo of a dentist lead generation system tracking 247 leads, 18 appointments, and $47k revenue in real-time.',
    images: ['/og-image.png'], // Replace with your actual image path
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}