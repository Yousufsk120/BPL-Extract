import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bengal Political Lab',
  description: 'Advanced Political Intelligence Platform for Bengal - Data extraction, analysis, and visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">&
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Bengal Political Lab</h1>
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    v1.0
                  </span>
                </div>
                <nav className="flex space-x-4">
                  <a href="#dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                  <a href="#analytics" className="text-gray-600 hover:text-gray-900">Analytics</a>
                  <a href="#data" className="text-gray-600 hover:text-gray-900">Data</a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}