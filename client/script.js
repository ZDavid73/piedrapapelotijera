const ws = new WebSocket('ws://localhost:8080');
let playerId;

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);

  if (data.type === 'welcome') {
    playerId = data.playerId;
    document.getElementById('status').innerText = `Conectado como Jugador ${playerId}`;
    document.getElementById('game').style.display = 'block';
  } else if (data.type === 'full') {
    document.getElementById('status').innerText = 'El juego está lleno. Inténtelo más tarde.';
  } else if (data.type === 'result') {
    document.getElementById('results').innerText = `Jugador 1: ${data.gameState.player1Move}, Jugador 2: ${data.gameState.player2Move}. Ganador: ${data.result}`;
    document.getElementById('scores').innerText = `Jugador 1 - Ganados: ${data.scores.player1.wins}, Perdidos: ${data.scores.player1.losses}. Jugador 2 - Ganados: ${data.scores.player2.wins}, Perdidos: ${data.scores.player2.losses}`;
  }
};

function makeMove(move) {
  ws.send(JSON.stringify({ type: 'move', move }));
}
