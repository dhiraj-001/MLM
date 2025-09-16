import { Montserrat, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { AnalyticsG } from "@/components/analytics"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"

// Bold, modern primary font
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

// Elegant accent font for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "700"],
})

export const metadata = {
  title: "leveluptrade",
  description:
    "Join our professional network of traders building sustainable income through our proven multi-level trading system.",
  keywords: "MLM, multi-level trading, business opportunity, passive income, financial independence, trading network",
  authors: [{ name: "leveluptrade" }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <Analytics />
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
            <AnalyticsG />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
