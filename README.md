# Neon Pong Supercharged

A neon-styled, single-file HTML5 PWA pong game with AI opponent and online multiplayer.

## What's Included

- `neon-pong-ai.html` — Single-player vs AI (3 difficulty levels)
- `neon-pong-online/` — Online multiplayer (Cloudflare Worker + client)
- `google-chat-bot/` — Google Chat bot integration
- `README.md` — This file

## Features

- **4 Game Modes**: Quick Match, Tournament, State Championship, World Cup
- **AI Opponent**: Easy, Medium, Hard difficulty
- **Online Multiplayer**: WebSocket-based, play with a friend
- **Trick System**: Edge shots, spin shots, smashes, rally multipliers
- **Task System**: Random challenges per match
- **PWA**: Installable on mobile, works offline
- **Google Chat Bot**: Launch the game from Google Chat

## Quick Start

### Single Player
Open `neon-pong-ai.html` in any browser. No server needed.

### Online Multiplayer
1. Deploy `neon-pong-online/worker.js` to Cloudflare Workers
2. Open `neon-pong-online/client.html` in a browser
3. Share a room code with a friend

### Google Chat Bot
See `google-chat-bot/README.md` for setup instructions.

## Tech Stack

- Pure HTML5 Canvas + JavaScript (no dependencies)
- Cloudflare Workers + Durable Objects (online multiplayer)
- Google Apps Script (Chat bot)
- Web Audio API (sound effects)

## License

MIT License — use it, modify it, share it.
