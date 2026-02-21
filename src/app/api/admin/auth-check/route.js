// app/api/admin/auth-check/route.js
// Validates the admin password without exposing it client-side.
import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TrimAdmin2024'

export async function POST(request) {
  const { password } = await request.json()
  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
