const express = require('express');
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = 4001;
const CORS_OPTIONS = {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', "POST"]
    }
};

const app = express();
app.use(cors())

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running in ${PORT} port...`));

const io = new Server(server, CORS_OPTIONS)

io.on("connection", (socket) => {

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined to room: ${room}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected : ${socket.id}`);
    })
});

