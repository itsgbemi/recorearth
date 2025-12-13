// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './components/AuthProvider' // Add this

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EarthRestorers - Take Direct Action to Restore Our Planet',
  description: 'Join a community that funds real projects. Learn practical skills. Vote on what gets done next.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
