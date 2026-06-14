const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io setup for real-time tracking
const io = new Server(server, {
  cors: {
    origin: '*', // To be restricted to frontend URL in production
    methods: ['GET', 'POST', 'PUT']
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_trip', (tripId) => {
    socket.join(tripId);
    console.log(`User ${socket.id} joined trip ${tripId}`);
  });

  socket.on('location_update', (data) => {
    // data should contain { tripId, location: { lat, lng } }
    io.to(data.tripId).emit('receive_location', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
