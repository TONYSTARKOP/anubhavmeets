const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve static files from the "public" folder

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('join-room', (userId) => {
        console.log(`User ${userId} joined the room.`);
        socket.broadcast.emit('user-connected', userId);
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
