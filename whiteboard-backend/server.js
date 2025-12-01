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
        
        // Notify all users in the room that someone joined
        socket.broadcast.to(roomId).emit("userJoinedNotification", {
            name: name,
            userId: userId
        });
        
        // Send existing whiteboard data to new user
        if (imgURLGlobal) {
            socket.emit("whiteBoardDataResponse", {
                imgURL: imgURLGlobal,
            });
        }
    });

    socket.on("whiteBoardData", (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
            imgURL: data,
        });
    });

    socket.on("kickUser", ({ userId, roomId }) => {
        const users = getUserInRoom(roomId);
        const userToKick = users.find(u => u.userId === userId);
        
        if (userToKick) {
            // Find the socket of the user to kick
            const sockets = io.sockets.sockets;
            for (let [id, sock] of sockets) {
                const user = getUser(id);
                if (user && user.userId === userId) {
                    // Remove user
                    removeUser(id);
                    
                    // Notify the kicked user
                    sock.emit("userKicked", {
                        userId: userId,
                        name: userToKick.name
                    });
                    
                    // Notify all other users in the room
                    const updatedUsers = getUserInRoom(roomId);
                    io.to(roomId).emit("allUsers", updatedUsers);
                    io.to(roomId).emit("userKicked", {
                        userId: userId,
                        name: userToKick.name
                    });
                    
                    // Disconnect the kicked user
                    sock.disconnect(true);
                    break;
                }
            }
        }
    });

    socket.on("leaveRoom", ({ userId, roomId, isHost, name }) => {
        const user = getUser(socket.id);
        
        if (user) {
            removeUser(socket.id);
            
            if (isHost) {
                // If host leaves, kick everyone from the room
                const roomUsers = getUserInRoom(roomId);
                
                // Notify all users that host left and room is closing
                io.to(roomId).emit("hostLeft", {
                    message: "Host has left the room. Room is closing."
                });
                
                // Disconnect all users in the room
                const sockets = io.sockets.sockets;
                for (let [id, sock] of sockets) {
                    const usr = getUser(id);
                    if (usr && usr.roomId === roomId) {
                        removeUser(id);
                        sock.disconnect(true);
                    }
                }
            } else {
                // Regular user leaving
                const updatedUsers = getUserInRoom(roomId);
                
                // Notify others in the room
                io.to(roomId).emit("allUsers", updatedUsers);
                io.to(roomId).emit("userLeftNotification", {
                    name: name,
                    userId: userId
                });
            }
            
            // Disconnect the leaving user
            socket.disconnect(true);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        const user = getUser(socket.id);
        
        if (user) {
            removeUser(socket.id);
            const roomUsers = getUserInRoom(user.roomId);
            
            // Notify all users in the room about the updated user list
            io.to(user.roomId).emit("allUsers", roomUsers);
            
            // Notify that user left
            io.to(user.roomId).emit("userLeftNotification", {
                name: user.name,
                userId: user.userId
            });
            
            io.to(user.roomId).emit("userDisconnected", {
                userId: user.userId,
                users: roomUsers
            });
        }
    });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("server is running on http://localhost:5000"));