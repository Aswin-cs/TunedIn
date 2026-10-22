# TunedIn

TunedIn is a full-stack music streaming web application inspired by Spotify. Built with Next.js, React, TypeScript, MongoDB, and NextAuth.js, TunedIn delivers high-fidelity audio playback, song exploration, personalized user profiles, and seamless Google authentication within a curated dark-themed studio interface.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TunedIn offers a streamlined, responsive listening experience. Users can browse music libraries, stream audio with real-time controls, manage playlists and favorites, and authenticate securely via Google OAuth. The interface implements custom CSS modular design tokens tailored for high contrast, accessibility, and modern aesthetics without relying on external utility frameworks.

---

## Key Features

- Continuous Audio Playback: Persistent bottom player with play, pause, seek, volume control, mute, shuffle, repeat, and progress tracking.
- Dynamic Music Catalog: Browse tracks fetched from MongoDB with fallback catalog support, categories, genre chips, and search filtering.
- Dedicated Song Experience: Dedicated track route (`/song/[id]`) featuring high-resolution cover art, lyrics display, artist details, audio duration, and stream counts.
- Authentication and User Accounts: Secure authentication via NextAuth.js with Google OAuth, guest fallback, and session persistence.
- Profile Management: Personalized user profile page (`/profile`) supporting custom avatar updates, username availability verification, bio editing, listening history, and liked songs.
- Modern Studio Interface: Handcrafted CSS modules utilizing design tokens for typography, warm dark mode palettes, smooth transitions, and responsive mobile layouts.
- RESTful API Architecture: Modular Next.js API routes connecting directly to MongoDB via Mongoose.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React 19
- TypeScript
- CSS Modules (Vanilla CSS design system with custom tokens)

### Backend & Database
- Next.js API Route Handlers
- MongoDB
- Mongoose ODM

### Authentication & Utilities
- NextAuth.js (Google OAuth provider)
- Standard Web Audio API and HTMLAudioElement integration

---

## Project Structure

```text
client/
├── config/
│   └── connectDb.ts            # MongoDB connection handler
├── models/
│   ├── song.model.ts           # Song Mongoose schema and model
│   └── user.model.ts           # User Mongoose schema and model
├── public/                     # Static assets, icons, and artwork
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth route and username check
│   │   │   ├── songs/          # Song retrieval and details APIs
│   │   │   └── user/           # User profile management API
│   │   ├── login/              # Login and authentication page
│   │   ├── profile/            # User profile and account settings page
│   │   ├── song/               # Dedicated song player and details page
│   │   ├── globals.css         # Global design variables and resets
│   │   ├── layout.tsx          # Root application layout
│   │   └── page.tsx            # Main dashboard and music player
│   ├── components/
│   │   └── providers/          # Client-side context providers (NextAuth)
│   ├── data/
│   │   └── tracks.ts           # Static fallback track library
│   ├── hooks/                  # Custom React hooks
│   └── lib/
│       ├── auth.ts             # NextAuth configuration options
│       └── songAdapter.ts      # Data transformers between schema and UI
├── design.md                   # Design tokens, color system, and typography
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Project documentation
```

---

## Prerequisites

Before running TunedIn, ensure the following tools are installed:

- Node.js (version 18.18.0 or later recommended)
- npm, yarn, pnpm, or bun
- A MongoDB database instance (local MongoDB instance or MongoDB Atlas cluster)
- Google Cloud Console OAuth 2.0 Credentials (for Google sign-in)

---

## Environment Variables

Create a file named `.env.local` in the root of the project directory. Populate it with the required configuration values:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_nextauth_secret_key

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### Notes on Environment Variables
- `NEXTAUTH_SECRET`: A secure random string used to hash tokens and sign cookies. Generate one using OpenSSL:
  ```bash
  openssl rand -base64 32
  ```
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Generated in Google Cloud Console under APIs & Services > Credentials > OAuth 2.0 Client IDs. Ensure `http://localhost:3000/api/auth/callback/google` is added to the Authorized Redirect URIs.

---

## Installation and Setup

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/Aswin-cs/TunedIn.git
   cd "TunedIn/client"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy or create your `.env.local` file as described in the [Environment Variables](#environment-variables) section.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`: Runs the app in development mode with hot-reloading at `http://localhost:3000`.
- `npm run build`: Compiles and builds the production application.
- `npm run start`: Starts the application in production mode after running the build.
- `npm run lint`: Analyzes project code for TypeScript and ESLint rule compliance.

---

## API Endpoints

The project includes built-in Next.js Route Handlers:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/songs` | Fetches the list of all available songs from the database. |
| GET | `/api/songs/[id]` | Retrieves metadata, stream details, and information for a specific song. |
| GET | `/api/user/profile` | Retrieves profile data for the currently authenticated user. |
| POST | `/api/user/profile` | Updates profile details (display name, bio, avatar, username). |
| GET | `/api/auth/check-username?username={name}` | Validates whether a requested username is available. |
| ALL | `/api/auth/[...nextauth]` | Handles NextAuth authentication workflows (login, callback, session). |

---

## Data Models

### Song (`models/song.model.ts`)
- `title` (String, required): Title of the song.
- `artist` (String, required): Performing artist or band.
- `album` (String): Album name.
- `coverImage` (String): URL or file path for album artwork.
- `audioUrl` (String, required): Streamable audio file source URL.
- `duration` (Number): Duration of track in seconds.
- `genre` (String): Musical genre.
- `plays` (Number): Total play count.
- `likes` (Number): Total like count.
- `lyrics` (String): Song lyrics text.

### User (`models/user.model.ts`)
- `name` (String): Display name of the user.
- `email` (String, unique): Email address from Google OAuth.
- `image` (String): Avatar image URL.
- `username` (String, unique): Custom username handle.
- `bio` (String): User biography or status message.
- `likedSongs` (Array of Song IDs): References to favorite songs.
- `history` (Array): Recently played tracks with timestamps.

---

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
