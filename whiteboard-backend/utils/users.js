const users = [];

const addUser = ({ name, userId, roomId, host, presenter, socketId }) => {
    const user = { name, userId, roomId, host, presenter, socketId };
    users.push(user);
    return users.filter((user) => user.roomId === roomId);
};

// remove user from list
const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (socketId) => {
    return users.find((user) => user.socketId === socketId);
};

const getUserInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom,
};