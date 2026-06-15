import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserIdFromRequest } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Fallback if no user or no history
    const getFallback = async () => {
      const res = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=10/json', { cache: 'no-store' });
      const data = await res.json();
      const entries = Array.isArray(data.feed.entry) ? data.feed.entry : [data.feed.entry];
      return entries.map((entry: any) => {
        let img = entry['im:image'] ? entry['im:image'][entry['im:image'].length - 1].label : '';
        img = img.replace(/\/[0-9]+x[0-9]+bb\.(png|jpg)/g, '/400x400bb.jpg');
        return {
          title: entry['im:name']?.label || 'Unknown Title',
          artist: entry['im:artist']?.label || 'Unknown Artist',
          cover: img || `https://picsum.photos/seed/${encodeURIComponent(entry['im:name']?.label || 'song')}/400/400`,
          appleMusicUrl: entry.link?.[0]?.attributes?.href || ''
        };
      });
    };

    if (!userId) {
      return NextResponse.json({ songs: await getFallback() });
    }

    // 1. Fetch History
    const historyRes = await query(
      'SELECT title, artist FROM scans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );

    const history = historyRes.rows;
    if (history.length === 0) {
      return NextResponse.json({ songs: await getFallback() });
    }

    // 2. Extract unique artists
    const uniqueArtists = Array.from(new Set(history.map(row => row.artist))).filter(Boolean);
    const seedArtists = uniqueArtists.slice(0, 3); // Take up to 3 recent unique artists

    if (seedArtists.length === 0) {
      return NextResponse.json({ songs: await getFallback() });
    }

    // 3. Query iTunes for each artist to find recommendations
    let recommendedSongs: any[] = [];
    for (const artist of seedArtists) {
      const searchRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=10`, { cache: 'no-store' });
      const data = await searchRes.json();
      
      if (data.results) {
        const mapped = data.results.map((r: any) => ({
          title: r.trackName,
          artist: r.artistName,
          cover: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '400x400bb') : '',
          appleMusicUrl: r.trackViewUrl
        }));
        recommendedSongs.push(...mapped);
      }
    }

    // 4. Filter out exact matches already in history and remove duplicates
    const historyTitles = new Set(history.map(h => h.title.toLowerCase()));
    
    const uniqueRecs = [];
    const seenTitles = new Set<string>();
    
    for (const song of recommendedSongs) {
      const tLow = song.title.toLowerCase();
      if (!historyTitles.has(tLow) && !seenTitles.has(tLow)) {
        uniqueRecs.push(song);
        seenTitles.add(tLow);
      }
    }

    // 5. Shuffle
    for (let i = uniqueRecs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueRecs[i], uniqueRecs[j]] = [uniqueRecs[j], uniqueRecs[i]];
    }

    // If somehow filtering left us with too few, pad with fallback
    let finalSongs = uniqueRecs.slice(0, 10);
    if (finalSongs.length < 5) {
      const fb = await getFallback();
      finalSongs = [...finalSongs, ...fb].slice(0, 10);
    }

    return NextResponse.json({ songs: finalSongs });
  } catch (error) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json({ songs: [] }, { status: 500 });
  }
}
