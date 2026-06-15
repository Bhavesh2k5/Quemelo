import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserIdFromRequest } from '@/utils/auth';
import { Shazam } from 'node-shazam';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Write file to temp directory
    const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${Math.random().toString(36).substring(7)}.webm`);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempFilePath, buffer);

    console.log('Sending to Shazam API...');
    const shazam = new Shazam();
    let data;
    try {
      data = await shazam.fromFilePath(tempFilePath, false, 'en');
    } catch (e) {
      console.error('Shazam processing error:', e);
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }

    console.log('Shazam Response:', data ? 'Success' : 'No match');

    if (!data || !data.track) {
      return NextResponse.json({ error: 'Song not recognized' }, { status: 404 });
    }

    const track = data.track;
    const title = track.title;
    const artist = track.subtitle;
    
    // Find album from metadata
    const mainSection = track.sections?.find((e: { type: string }) => e.type === 'SONG');
    const album = mainSection?.metadata?.find((e: { title: string; text: string }) => e.title === 'Album')?.text || null;
    
    // Find cover art
    const cover_art = track.images?.coverarthq || track.images?.coverart || null;
    
    // Spotify URL? Shazam might not provide Spotify URL directly, but it provides Apple Music URL.
    // Let's check track.hub.providers for spotify
    const spotifyProvider = track.hub?.providers?.find((p: { type: string; actions?: { uri: string }[] }) => p.type === 'SPOTIFY');
    const spotify_url = spotifyProvider?.actions?.[0]?.uri || null;

    // Extract extra Shazam data
    const lyricsSection = track.sections?.find((s: { type: string }) => s.type === 'LYRICS');
    const lyrics = lyricsSection?.text?.join('\n') || null;

    const videoSection = track.sections?.find((s: { type: string }) => s.type === 'VIDEO');
    const youtube_url = videoSection?.youtubeurl || null;

    const genre = track.genres?.primary || null;

    const apple_music_url = track.hub?.options?.find((o: any) => o.caption === 'OPEN' || o.listenservice === 'apple')?.actions?.[0]?.uri || null;

    const shazam_url = track.url || null;

    const result = {
      title,
      artist,
      album,
      cover_art,
      spotify_url,
      lyrics,
      youtube_url,
      genre,
      apple_music_url,
      shazam_url,
      matched: true,
    };

    // Save to history if logged in
    const userId = getUserIdFromRequest(req);
    if (userId) {
      await query(
        `INSERT INTO scans (user_id, title, artist, album, cover_art, spotify_url, matched, lyrics, youtube_url, genre, apple_music_url, shazam_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          userId, 
          result.title, 
          result.artist, 
          result.album, 
          result.cover_art, 
          result.spotify_url, 
          true,
          result.lyrics,
          result.youtube_url,
          result.genre,
          result.apple_music_url,
          result.shazam_url
        ]
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Recognition error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


