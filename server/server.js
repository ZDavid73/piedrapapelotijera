const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let players = [];
let gameState = {};

wss.on('connection', (ws) => {
  if (players.length < 2) {
    const playerId = players.length + 1;
    players.push({ ws, id: playerId, wins: 0, losses: 0 });

    ws.send(JSON.stringify({ type: 'welcome', playerId }));

    ws.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'move') {
        gameState[`player${playerId}Move`] = data.move;

        if (gameState.player1Move && gameState.player2Move) {
          const result = determineWinner(gameState.player1Move, gameState.player2Move);
          updateScores(result);

          players.forEach((player) => {
            player.ws.send(JSON.stringify({
              type: 'result',
              gameState,
              result,
              scores: {
                player1: { wins: players[0].wins, losses: players[0].losses },
                player2: { wins: players[1].wins, losses: players[1].losses },
              }
            }));
          });

          gameState = {};
        }
      }
    });

    ws.on('close', () => {
      players = players.filter((player) => player.id !== playerId);
    });
  } else {
    ws.send(JSON.stringify({ type: 'full' }));
    ws.close();
  }
});

function determineWinner(move1, move2) {
  if (move1 === move2) return 'draw';
  if (
    (move1 === 'rock' && move2 === 'scissors') ||
    (move1 === 'scissors' && move2 === 'paper') ||
    (move1 === 'paper' && move2 === 'rock')
  ) {
    return 'player1';
  } else {
    return 'player2';
  }
}

function updateScores(result) {
  if (result === 'player1') {
    players[0].wins++;
    players[1].losses++;
  } else if (result === 'player2') {
    players[0].losses++;
    players[1].wins++;
  }
}

console.log('WebSocket server is running on ws://localhost:8080');
