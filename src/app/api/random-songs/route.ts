import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const terms = [
      "pop", "rock", "love", "night", "synth", "dance", "dream", "star", 
      "fire", "heart", "time", "world", "light", "summer", "rain", "city", 
      "baby", "girl", "boy", "moon", "sun", "life", "soul", "mind", "run",
      "walk", "fly", "ocean", "river", "wind", "storm", "magic", "wild"
    ];
    const term = terms[Math.floor(Math.random() * terms.length)];
    
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=50`, {
      cache: 'no-store'
    });
    
    const data = await res.json();
    
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ songs: [] });
    }
    
    // Shuffle the 50 results
    const results = data.results;
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }
    
    // Take 10 and map
    const selected = results.slice(0, 10).map((r: any) => ({
      t: r.trackName,
      a: r.artistName,
      cover: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '400x400bb') : '',
      apple: r.trackViewUrl
    }));
    
    return NextResponse.json({ songs: selected, term: term });
  } catch (error) {
    console.error('Error fetching random songs:', error);
    return NextResponse.json({ songs: [], term: '' }, { status: 500 });
  }
}
