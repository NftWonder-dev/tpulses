'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PasswordProtection from '@/components/PasswordProtection'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    // Admin routes: bare, no nav, no footer, no password gate
    return <main>{children}</main>
  }

  return (
    <PasswordProtection>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </PasswordProtection>
  )
}
