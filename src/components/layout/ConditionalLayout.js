'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PasswordProtection from '@/components/PasswordProtection'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  // The admin area is protected server-side by app/admin/layout.js.
  if (isAdmin) {
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
