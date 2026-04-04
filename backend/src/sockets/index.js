const rankingSocket = require('./rankingSocket');
const partidoSocket = require('./partidoSocket');

const iniciarSockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('unirse:torneo', (id) => socket.join(`torneo:${id}`));
    socket.on('unirse:grupo',  (id) => socket.join(`grupo:${id}`));
    socket.on('disconnect', () => {});
  });
  rankingSocket(io);
  partidoSocket(io);
};
module.exports = iniciarSockets;