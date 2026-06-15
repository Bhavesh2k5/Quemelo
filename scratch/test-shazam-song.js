const fs = require('fs');
const { Shazam } = require('node-shazam');
const https = require('https');
const path = require('path');

const audioUrl = 'https://p.scdn.co/mp3-preview/b67a1451f2cd3f7de9d8bb10904128f73f2c5897?cid=774b29d4f13844c495f206cafdad9c86'; // Blinding Lights preview
const tmpFile = path.join(__dirname, 'blinding_lights.mp3');

async function test() {
  const file = fs.createWriteStream(tmpFile);
  https.get(audioUrl, (response) => {
    response.pipe(file);
    file.on('finish', async () => {
      file.close();
      try {
        const shazam = new Shazam();
        const data = await shazam.fromFilePath(tmpFile, false, 'en');
        const track = data.track;
        
        console.log('Title:', track.title);
        
        const lyricsSection = track.sections?.find(s => s.type === 'LYRICS');
        console.log('Lyrics present:', !!lyricsSection);
        if (lyricsSection) {
          console.log('Lyrics keys:', Object.keys(lyricsSection));
          console.log('First line:', lyricsSection.text[0]);
        }
        
        const videoSection = track.sections?.find(s => s.type === 'VIDEO');
        console.log('Video present:', !!videoSection);
        if (videoSection) {
          console.log('Video keys:', Object.keys(videoSection));
          console.log('Youtube URL:', videoSection.youtubeurl);
        }
        
        console.log('Hub:', JSON.stringify(track.hub, null, 2));
      } catch (e) {
        console.error(e);
      }
    });
  });
}

test();
