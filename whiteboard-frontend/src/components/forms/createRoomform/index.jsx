import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateRoomForm = ({ uuid, socket, setUser }) => {
    const [roomId, setRoomId] = useState(uuid());
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to clipboard!", {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (err) {
            toast.error("Failed to copy Room ID", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handelCreateRoom = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter your name", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const roomData = {
            name,
            roomId,
            userId: uuid(),
            host: true,
            presenter: true,
        };
        setUser(roomData);
        navigate(`/${roomId}`);
        socket.emit("userJoined", roomData);
        
        toast.success("Room created successfully!", {
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
            <div className="form-group border rounded-3">
                <div className="input-group d-flex align-items-center justify-content-center bg-gray rounded-3">
                    <input
                        type="text"
                        value={roomId}
                        className="form-control my-2 border-0"
                        disabled
                        placeholder="Generate Room ID"
                    />
                    <div className="input-group-append ">
                        <button
                            className="btn btn-primary btn-sm me-1"
                            type="button"
                            onClick={() => setRoomId(uuid())}
                        >
                            Generate
                        </button>
                        <button
                            className="btn btn-outline-success btn-sm me-2"
                            type="button"
                            onClick={handleCopyRoomId}
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                className="mt-4 btn btn-primary btn-block form-control"
                onClick={handelCreateRoom}
            >
                Create Room
            </button>
        </form>
    );
};

export default CreateRoomForm;