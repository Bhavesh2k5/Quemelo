import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserIdFromRequest } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details
    const result = await query('SELECT id, email, username, created_at FROM users WHERE id = $1', [userId]);
    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
