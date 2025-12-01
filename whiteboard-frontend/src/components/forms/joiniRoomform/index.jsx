import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JoinRoomForm = ({ socket, setUser, uuid }) => {
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handelRoomJoin = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter your name", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        if (!roomId.trim()) {
            toast.error("Please enter Room ID", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const roomData = {
            name,
            roomId,
            userId: uuid,
            host: false,
            presenter: false,
        };
        setUser(roomData);
        navigate(`/${roomId}`);
        socket.emit("userJoined", roomData);
        
        toast.success("Joining room...", {
            position: "top-center",
            autoClose: 2000,
        });
    };

    return (
        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group ">
                <input
                    type="text"
                    className="form-control my-2 "
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
            </div>
            <button
                type="submit"
                onClick={handelRoomJoin}
                className="mt-4 btn btn-primary btn-block form-control"
            >
                Join Room
            </button>
        </form>
    );
};

export default JoinRoomForm;