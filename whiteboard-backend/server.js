const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUser, getUserInRoom } = require("./utils/users");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("this is the mern realtime whiteboard sharing app backend");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data;
        roomIdGlobal = roomId;
        socket.join(roomId);
        
        const users = addUser({ ...data, socketId: socket.id });
        
        socket.emit("userIsJoined", { success: true, users });
        socket.broadcast.to(roomId).emit("allUsers", users);
        
        // Send existing whiteboard data to new user
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
            imgURL: imgURLGlobal,
        });
    });

    socket.on("whiteBoardData", (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
            imgURL: data,
        });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        const user = getUser(socket.id);
        
        if (user) {
            removeUser(socket.id);
            const roomUsers = getUserInRoom(user.roomId);
            
            // Notify all users in the room about the updated user list
            io.to(user.roomId).emit("allUsers", roomUsers);
            io.to(user.roomId).emit("userDisconnected", {
                userId: user.userId,
                users: roomUsers
            });
        }
    });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("server is running on http://localhost:5000"));