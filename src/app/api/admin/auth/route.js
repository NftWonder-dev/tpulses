// app/api/admin/auth/route.js
// Handles admin login form submission and sets a session cookie.
import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  checkAdminPassword,
  createAdminToken,
} from '@/lib/adminAuth'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const password = formData.get('password')
    // Only redirect within the admin area, never to another site.
    const requested = formData.get('redirect')
    const redirectTo =
      typeof requested === 'string' && requested.startsWith('/admin')
        ? requested
        : '/admin'

    if (checkAdminPassword(password)) {
      const response = NextResponse.redirect(new URL(redirectTo, request.url))
      response.cookies.set(ADMIN_COOKIE, await createAdminToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_SESSION_SECONDS,
        path: '/',
      })
      return response
    }

    // Wrong password — redirect back with error param
    const loginUrl = new URL('/admin', request.url)
    loginUrl.searchParams.set('error', '1')
    return NextResponse.redirect(loginUrl)
  } catch (err) {
    return NextResponse.json({ error: 'Auth error' }, { status: 500 })
  }
}

// GET: logout
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('action') === 'logout') {
    const response = NextResponse.redirect(new URL('/admin', request.url))
    response.cookies.delete(ADMIN_COOKIE)
    return response
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
