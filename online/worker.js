// Neon Pong Online - WebSocket Relay Server
// Cloudflare Worker with Durable Objects for room state

export class GameRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.players = new Map(); // ws -> {id, name, paddle, ready, score}
    this.gameState = null;
  }

  async fetch(request) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    server.accept();

    const playerId = Math.random().toString(36).substring(2, 8);
    const playerNumber = this.players.size + 1;
    const player = { id: playerId, ws: server, paddle: 0, ready: false, score: 0, playerNumber };
    
    if (this.players.size >= 2) {
      server.send(JSON.stringify({ type: 'error', message: 'Room full' }));
      server.close();
      return new Response(null, { status: 101, webSocket: client });
    }

    this.players.set(server, player);
    
    server.send(JSON.stringify({ 
      type: 'connected', 
      playerId,
      playerNumber 
    }));

    if (this.players.size === 2) {
      this.broadcast({ type: 'start', players: this.getPlayerList() });
    }

    server.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(server, player, data);
      } catch (e) {
        console.error('Invalid message:', e);
      }
    });

    server.addEventListener('close', () => {
      this.players.delete(server);
      if (this.players.size === 0) {
        this.state.storage.deleteAll();
      } else {
        this.broadcast({ type: 'opponent_left' });
      }
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  handleMessage(ws, player, data) {
    switch (data.type) {
      case 'paddle':
        player.paddle = data.value;
        break;
      case 'ready':
        player.ready = true;
        if (this.players.size === 2 && [...this.players.values()].every(p => p.ready)) {
          this.startGame();
        }
        break;
      case 'restart':
        this.broadcast({ type: 'restart' });
        break;
    }
  }

  startGame() {
    this.gameState = {
      ball: { x: 180, y: 320, vx: 0, vy: 0 },
      paddles: [0, 0],
      scores: [0, 0],
      rally: 0
    };
    this.broadcast({ type: 'game_start', state: this.gameState });
  }

  broadcast(message) {
    const msg = JSON.stringify(message);
    for (const [ws, player] of this.players) {
      try {
        ws.send(msg);
      } catch (e) {
        this.players.delete(ws);
      }
    }
  }

  getPlayerList() {
    return [...this.players.values()].map(p => ({
      id: p.id,
      playerNumber: p.playerNumber,
      ready: p.ready
    }));
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get('room') || 'default';
    
    const id = env.GAME_ROOMS.idFromName(roomId);
    const room = env.GAME_ROOMS.get(id);
    
    return room.fetch(request);
  }
};
