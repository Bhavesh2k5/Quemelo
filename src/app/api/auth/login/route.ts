import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const result = await query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate token
    const token = signToken(user.id);

    // Set cookie
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.cookies.set({
      name: 'quemelo_auth',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
