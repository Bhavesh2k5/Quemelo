import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserIdFromRequest } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      'SELECT id, title, artist, album, cover_art, spotify_url, lyrics, youtube_url, genre, apple_music_url, shazam_url, created_at FROM scans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
