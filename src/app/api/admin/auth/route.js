// app/api/admin/auth/route.js
// Handles admin login form submission and sets a session cookie.
import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TrimAdmin2024'
const COOKIE_NAME = 'tp_admin_auth'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const password = formData.get('password')
    const redirectTo = formData.get('redirect') || '/admin'

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.redirect(new URL(redirectTo, request.url))
      response.cookies.set(COOKIE_NAME, ADMIN_PASSWORD, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
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
    response.cookies.delete(COOKIE_NAME)
    return response
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
