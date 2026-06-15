import { NextRequest, NextResponse } from 'next/server';

const GENRE_MAP: Record<string, string> = {
  'ALL': '',
  'POP': '14',
  'HIP-HOP': '18',
  'ELECTRONIC': '17',
  'ROCK': '21',
  'SYNTHWAVE': '20', // Using alternative as a fallback
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('genre') || 'ALL';
    
    const genreId = GENRE_MAP[filter.toUpperCase()];
    const genrePath = genreId ? `/genre=${genreId}` : '';
    
    // Fetch top 20 from iTunes RSS
    const rssUrl = `https://itunes.apple.com/us/rss/topsongs/limit=20${genrePath}/json`;
    const res = await fetch(rssUrl, { cache: 'no-store' });
    const data = await res.json();
    
    if (!data.feed || !data.feed.entry) {
      return NextResponse.json({ songs: [] });
    }
    
    const entries = Array.isArray(data.feed.entry) ? data.feed.entry : [data.feed.entry];
    
    const songs = entries.map((entry: any) => {
      // Get highest res image and boost size to 400x400
      let img = entry['im:image'] ? entry['im:image'][entry['im:image'].length - 1].label : '';
      img = img.replace(/\/[0-9]+x[0-9]+bb\.(png|jpg)/g, '/400x400bb.jpg');
      
      return {
        title: entry['im:name']?.label || 'Unknown Title',
        artist: entry['im:artist']?.label || 'Unknown Artist',
        genre: entry.category?.attributes?.label || filter,
        img: img || `https://picsum.photos/seed/${encodeURIComponent(entry['im:name']?.label || 'song')}/400/400`,
        appleMusicUrl: entry.link?.[0]?.attributes?.href || ''
      };
    });
    
    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Trending API Error:', error);
    return NextResponse.json({ songs: [] }, { status: 500 });
  }
}
