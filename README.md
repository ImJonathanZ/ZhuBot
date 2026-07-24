# ZhuBot

A Discord bot built for friend group servers, combining practical moderation tools with fun, automated features. Named after Zubat from Pokémon as a play on my last name (Zhu).

## Features

### Slash Commands

| Command | Description | Permissions |
|---------|-------------|-------------|
| `/ping` | Check bot and API latency | Everyone |
| `/lfg <user>` | Ping a user with a randomized humorous message | Everyone |
| `/purge <amount> [user]` | Bulk delete up to 100 messages, with optional user filter | Manage Messages |
| `/food [search]` | Browse food places spotted in the server, with optional name filter | Everyone |

### Automated Message Monitoring

**Gambling Detection**
Watches for gambling-related keywords and responds with mental health resources, including links to Connexontario, the National Problem Gambling Helpline, and Gambling Therapy.

**Spotify Link Reactions**
Automatically reacts to Spotify links with 🔥 and 👎 so server members can vote on tracks.

**Instagram Food Post Parser**
Detects Instagram links in a designated channel and automatically:
- Scrapes the post caption and thumbnail via HTTP (no Instagram API required)
- Extracts the restaurant name from the caption
- Optionally fetches restaurant details (rating, price level, address) from the Google Places API
- Replies with an embed containing buttons to Google Maps and the original post
- Saves every parsed post to a local SQLite database for later retrieval via `/food`

## Tech Stack

- **Runtime:** Node.js
- **Discord API:** discord.js v14
- **Database:** better-sqlite3 (local SQLite for food place storage)
- **HTTP Client:** axios (for Instagram scraping and Google Places API)
- **Environment Management:** dotenv
- **Dev Tooling:** nodemon

## Project Structure

```
src/
├── index.js                    # Entry point — client setup and handler initialization
├── commands/
│   └── tools/                  # Slash command definitions (ping, lfg, purge, food)
├── database/
│   └── db.js                   # SQLite setup and food place queries
├── events/
│   └── client/                 # Event listeners (ready, interactionCreate, sendMessage)
└── functions/
    └── handlers/               # Dynamic command and event loaders
data/
└── food_places.db              # SQLite database (auto-created on first run)
```

Commands and events are loaded dynamically at startup — adding a new file to the appropriate folder registers it automatically, with no manual wiring needed.

## Setup

**Prerequisites:** Node.js, a Discord bot application

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root:
   ```
   token=YOUR_DISCORD_BOT_TOKEN
   clientID=YOUR_CLIENT_ID
   guildID=YOUR_GUILD_ID
   applicationID=YOUR_APPLICATION_ID
   GOOGLE_PLACES_API_KEY=YOUR_KEY   # Optional — enables restaurant lookup
   ```

3. Start the bot:
   ```bash
   npm test          # Run once
   npm run dev       # Run with auto-restart (nodemon)
   ```

## Configuration

Set `USE_GOOGLE_API = true` in [src/events/client/sendMessage.js](src/events/client/sendMessage.js) to enable Google Places restaurant lookups for Instagram food posts. When disabled, the bot still parses and embeds post content without external API calls. Either way, all parsed posts are saved to the local database.

## Author

Jonathan Zhu — [GitHub](https://github.com/ImJonathanZ)
