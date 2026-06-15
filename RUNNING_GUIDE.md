# Quemelo — Audio Fingerprinting & Music Recognition Platform
### How to Run, Seed, and Test

**Quemelo** is a premium, zero-cost, local audio fingerprinting and music recognition system modeled after the engineering principles of applications like Shazam. It compiles and runs completely offline on your local machine.

---

## 🚀 Quick Start Guide

### Prerequisites
Before running, make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or newer, Node 22 is recommended)
*   [PostgreSQL](https://www.postgresql.org/) (Running on port `5432`)
*   *(Optional)* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Option A: Running via Docker (Recommended, One-Click Setup)
Since Docker isolates the database and credentials automatically inside containers, this option runs out of the box with zero database password setups:

1.  **Open Docker Desktop** on your computer.
2.  **Start the containers**:
    ```bash
    docker compose up --build
    ```
    *Next.js will automatically detect the database container, create the `quemelo` database, sharded tables, and indexes.*
3.  **Synthesize, Seed, and Test**: Open a second terminal window in the project folder and run:
    ```bash
    # 1. Synthesize the test tracks (creates scale_melody.wav and arpeggio_melody.wav in dataset/)
    npm run gen-demo

    # 2. Ingest the demo tracks to index them in your running database
    npm run seed

    # 3. Run the automated matching test to verify the DSP pipeline's accuracy
    npm run test-match
    ```
4.  **Open the Web Interface**: Go to [http://localhost:3000](http://localhost:3000) in your browser.
5.  **To Stop the Containers**: Press `Ctrl + C` or run:
    ```bash
    docker compose down
    ```

---

## Option B: Running Locally (Fastest Development Mode)
To run directly on your host machine:

1.  **Configure Environment Variables**:
    Open the `.env.local` file in the root folder and edit the `DB_PASSWORD` line with your actual PostgreSQL installation password:
    ```env
    DB_USER=postgres
    DB_PASSWORD=your_actual_postgres_password_here
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=quemelo
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Next.js Server**:
    ```bash
    npm run dev
    ```
    *The database, tables, and partitions will be automatically created on the first server query request.*
4.  **Ingest Demo Songs (Open a second terminal window)**:
    ```bash
    # 1. Synthesize the demo WAV melodies
    npm run gen-demo

    # 2. Upload them to the database
    npm run seed
    ```
5.  **Run Validation Test**:
    ```bash
    npm run test-match
    ```
6.  **Open the Web Interface**: Go to [http://localhost:3000](http://localhost:3000) in your browser.
7.  **To Stop the Server**: Press `Ctrl + C` in your dev terminal.

---

## 🛠️ Custom Command Reference

*   `npm run dev`: Starts the Next.js App Router server in development mode.
*   `npm run build`: Compiles production assets and builds the lightweight standalone container files.
*   `npm run start`: Boots the compiled Next.js production server.
*   `npm run gen-demo`: Synthesizes raw WAV audio files (using mathematical sine wave oscillators) inside the `dataset` directory.
*   `npm run seed`: Sequentially uploads all `.wav` tracks inside the `dataset` folder to the server's indexing API route.
*   `npm run test-match`: Binary-crops a 4-second segment of `scale_melody.wav` and POSTs it to the recognition API to assert the DSP offset alignment functions with 100% accuracy.
*   `node scripts/clear-db.js`: Resets and clears all song metadata and sharded fingerprints from the PostgreSQL tables.
*   `node scripts/test-db.js`: Diagnoses your `.env.local` credentials and tests direct TCP connectivity to your PostgreSQL host.

---

## 🧠 DSP Pipeline & Architecture Specifications

*   **Audio Standard**: 16,000 Hz, 16-bit, mono channel PCM WAV format.
*   **Windowing**: 1024-sample Hanning window with 50% overlap (512-sample stride / 32ms frames).
*   **FFT**: Radix-2 Cooley-Tukey FFT algorithm in TypeScript.
*   **Log-Amplitude Spectrogram**: Natural log dynamic compression: $L(t, f) = \log(1.0 + 1000.0 \times \text{mag})$.
*   **Peak Landmarking**: Local maximums extraction using a 7x7 grid.
*   **Combinatorial Hashing**: Anchor peaks are paired with target peaks in future frames. Target zones are constrained to $dt \in [1, 40]$ and $df \in [-40, 40]$. Bitwise packed into a 23-bit signed integer hash:
    $$\text{hash} = (f_1 \ll 15) \mid (f_2 \ll 6) \mid (t_2 - t_1)$$
*   **Database Partitioning**: The `fingerprints` table is sharded into **100 partitions** in PostgreSQL using hash-modulo sharding on the `hash` column to optimize index sizing for limited RAM environments.
