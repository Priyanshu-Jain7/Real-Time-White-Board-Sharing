import Forms from './components/forms';
import { Routes, Route } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const server = "http://localhost:5000";

const connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("userIsJoined", (data) => {
            if (data.success) {
                console.log("User joined successfully");
                setUsers(data.users);
            } else {
                console.log("User joined error");
            }
        });

        socket.on("allUsers", (data) => {
            console.log("All users updated:", data);
            setUsers(data);
        });

        socket.on("userDisconnected", (data) => {
            console.log("User disconnected:", data);
            setUsers(data.users);
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off("userIsJoined");
            socket.off("allUsers");
            socket.off("userDisconnected");
        };
    }, []);

    const uuid = () => {
        let S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (
            S4() + S4() + "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4()
        );
    };

    return (
        <div className='container'>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
                <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users} />} />
            </Routes>
        </div>
    );
};

export default App;