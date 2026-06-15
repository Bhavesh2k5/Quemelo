# QUEMELO 🎵⚡

> **That Song. Right Now. Yours.**
> The ultimate, high-octane music recognition and discovery platform built for the 2am moment.

![Quemelo Banner](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop)

QUEMELO is a next-generation music identification platform that goes far beyond just telling you the name of a song. It instantly identifies audio, builds a permanent library of your discoveries, and generates live, algorithmic recommendations based entirely on your taste—all wrapped in an unapologetically bold, cyberpunk-inspired 3D interface.

---

## 🔥 Core Features

*   **Lightning Audio Recognition:** Powered by a backend audio-fingerprinting wrapper that identifies tracks in seconds, providing exact metadata, high-res album art, and direct Apple Music links.
*   **Live Global Trending Engine:** The Discover page connects directly to Apple's Live RSS Feeds, pulling the real-time top 20 charting songs across Pop, Hip-Hop, and Electronic genres.
*   **Personalized "Mix" Algorithm:** Our custom recommendation engine scans your PostgreSQL history, cross-references the artists you've discovered, and injects entirely new tracks into your feed without relying on heavy third-party tracking.
*   **Secure User Profiles:** Full JWT-based authentication system with hashed `bcrypt` passwords, allowing users to save their library and update their alias and security settings securely.
*   **Dynamic 3D Interface:** Built completely from scratch using vanilla CSS, featuring infinite scrolling marquees, draggable 3D rotating cards, and interactive hover mechanics. No Tailwind, no bloated UI libraries.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14 (App Router), React, Typescript, Vanilla CSS
*   **Backend:** Next.js API Routes (Serverless)
*   **Database:** PostgreSQL (`pg` library)
*   **Authentication:** JWT (JSON Web Tokens), `bcryptjs`
*   **Audio Engine:** `node-shazam` 

---

## 🚀 Getting Started

Follow these instructions to run QUEMELO locally on your machine.

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running locally (or a cloud DB URL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/quemelo.git
   cd quemelo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Configuration:**
   Make sure PostgreSQL is running on your machine. By default, the app looks for `postgres/postgres` on `localhost:5432`. If you are using custom credentials, create a `.env.local` file in the root directory:
   ```env
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=quemelo
   JWT_SECRET=generate_a_random_64_character_string_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *Note: On first launch, the app will automatically run a database migration to create all necessary tables and columns!*

5. **Open the App:**
   Visit `http://localhost:3000` in your browser.

---

## ⚠️ Important Deployment Notice

If you plan to deploy QUEMELO to production (e.g., Vercel, AWS), please be aware of the following architectural changes that **must** be made:
1. **Audio Recognition API:** The current implementation uses `node-shazam`. Shazam actively blocks datacenter IP addresses. For a production environment, you must swap the API route in `src/app/api/recognize/route.ts` to use an official API key from **ACRCloud** or RapidAPI.
2. **Serverless Filesystems:** The app currently writes temporary audio chunks to `os.tmpdir()`. If deploying to serverless environments with strict memory limits, ensure you stream buffers directly or compress audio on the client.
3. **Database Migration:** Point your `.env` to a managed cloud PostgreSQL instance (like Supabase or Neon).

---

## 🤝 Contributing

Contributions are always welcome! Whether it's squashing bugs, optimizing the custom CSS grid, or integrating new music providers (Spotify/Soundcloud).

Please read the `CONTRIBUTING.md` file for guidelines on how to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
