const configurarSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket conectado: ' + socket.id);
    socket.on('unirse:torneo', (id) => socket.join('torneo:' + id));
    socket.on('unirse:grupo', (id) => socket.join('grupo:' + id));
    socket.on('disconnect', () => console.log('Socket desconectado: ' + socket.id));
  });
};

module.exports = configurarSockets;