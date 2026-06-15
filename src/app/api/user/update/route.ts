import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserIdFromRequest } from '@/utils/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, email, password, currentPassword } = await req.json();

    if (email) {
      // Check if email already exists for another user
      const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailCheck.rowCount && emailCheck.rowCount > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    // Update dynamically based on provided fields
    const updates = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramIndex++}`);
      params.push(username);
    }

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      params.push(email);
    }

    if (password) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      
      const userRes = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
      if (userRes.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const isValid = await bcrypt.compare(currentPassword, userRes.rows[0].password_hash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${paramIndex++}`);
      params.push(passwordHash);
    }

    if (updates.length > 0) {
      params.push(userId);
      await query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        params
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Update User Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
