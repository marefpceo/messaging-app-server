const socketio = require('socket.io');
const io = socketio();
const socketApi = {
  /* Server Options */
};

socketApi.io = io;

io.on('connection', (socket) => {
  console.log('Connection made');
});

module.exports = socketApi;
