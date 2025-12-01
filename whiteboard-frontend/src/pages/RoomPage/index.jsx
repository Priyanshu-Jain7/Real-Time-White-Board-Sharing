import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./index.css";
import WhiteBoard from "../../components/whiteBoard";

const RoomPage = ({ user, socket, users }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("black");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openedUserTab, setOpenedUserTab] = useState(false);

    // Toast notifications for user join/leave
    useEffect(() => {
        socket.on("userJoinedNotification", (data) => {
            toast.info(`${data.name} joined the room`, {
                position: "top-right",
                autoClose: 3000,
            });
        });

        socket.on("userLeftNotification", (data) => {
            toast.warn(`${data.name} left the room`, {
                position: "top-right",
                autoClose: 3000,
            });
        });

        socket.on("userKicked", (data) => {
            if (user?.userId === data.userId) {
                toast.error("You have been removed from the room by the host", {
                    position: "top-center",
                    autoClose: 5000,
                });
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                toast.warn(`${data.name} was removed from the room`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        });

        socket.on("hostLeft", (data) => {
            toast.error("The host has left. Room is closing...", {
                position: "top-center",
                autoClose: 3000,
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        });

        return () => {
            socket.off("userJoinedNotification");
            socket.off("userLeftNotification");
            socket.off("userKicked");
            socket.off("hostLeft");
        };
    }, [socket, user]);

    const handelClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);
    };

    const undo = () => {
        setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]]);
        setElements((prevElements) =>
            prevElements.slice(0, prevElements.length - 1)
        );
    };

    const redo = () => {
        setElements((prevElements) => [...prevElements, history[history.length - 1]]);
        setHistory((prevHistory) =>
            prevHistory.slice(0, prevHistory.length - 1)
        );
    };

    const handleKickUser = (userId, userName) => {
        if (window.confirm(`Are you sure you want to remove ${userName} from the room?`)) {
            socket.emit("kickUser", { userId, roomId: user.roomId });
        }
    };

    const handleLeaveRoom = () => {
        const leaveMessage = user?.host 
            ? "As the host, leaving will close the room for everyone. Are you sure?"
            : "Are you sure you want to leave the room?";
            
        if (window.confirm(leaveMessage)) {
            socket.emit("leaveRoom", { 
                userId: user.userId, 
                roomId: user.roomId,
                isHost: user.host,
                name: user.name
            });
            
            toast.info("You left the room", {
                position: "top-center",
                autoClose: 2000,
            });
            
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    };

    return (
        <div className="row">
            <button
                type="button"
                className="btn btn-dark"
                style={{
                    display: "block",
                    position: "absolute",
                    top: "5%",
                    left: "5%",
                    height: "40px",
                    width: "100px",
                }}
                onClick={() => setOpenedUserTab(true)}
            >
                Users
            </button>
            
            <button
                type="button"
                className="btn btn-danger"
                style={{
                    display: "block",
                    position: "absolute",
                    top: "5%",
                    right: "5%",
                    height: "40px",
                    width: "100px",
                }}
                onClick={handleLeaveRoom}
            >
                Leave
            </button>
            {openedUserTab && (
                <div
                    className="position-fixed top-0 h-100 text-white bg-dark"
                    style={{ width: "300px", left: "0%", zIndex: 1000, overflowY: "auto" }}
                >
                    <button
                        type="button"
                        onClick={() => setOpenedUserTab(false)}
                        className="btn btn-light btn-block w-100 mt-3"
                    >
                        Close
                    </button>
                    <div className="w-100 mt-4 px-3">
                        <h5 className="text-center mb-3">Room Members</h5>
                        {users.map((usr, index) => (
                            <div
                                key={index * 999}
                                className="d-flex justify-content-between align-items-center bg-secondary rounded p-2 mb-2"
                            >
                                <div>
                                    <p className="my-0">
                                        {usr.name}
                                        {user && user.userId === usr.userId && " (You)"}
                                        {usr.host && " 👑"}
                                    </p>
                                    <small className="text-muted">
                                        {usr.presenter ? "Presenter" : "Viewer"}
                                    </small>
                                </div>
                                {user?.host && 
                                 user.userId !== usr.userId && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleKickUser(usr.userId, usr.name)}
                                    >
                                        Kick
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <h1 className="text-center py-4">
                WhiteBoard Sharing Room
                <span className="text-primary"> [Users Online: {users.length}]</span>
            </h1>

            {user?.presenter && (
                <div className="col-md-10 mx-auto px-5 mt-4 mb-5 d-flex align-items-center justify-content-center">
                    <div className="d-flex col-md-3 justify-content-between gap-1">
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="pencil">pencil</label>
                            <input
                                type="radio"
                                name="tool"
                                className="my-0"
                                id="pencil"
                                value="pencil"
                                checked={tool === "pencil"}
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="line" className="my-0">
                                line
                            </label>
                            <input
                                type="radio"
                                name="tool"
                                className="my-0"
                                id="line"
                                value="line"
                                checked={tool === "line"}
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="rect" className="my-0">
                                Rectangle
                            </label>
                            <input
                                type="radio"
                                name="tool"
                                className="my-0"
                                id="rect"
                                value="rect"
                                checked={tool === "rect"}
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 mx-auto">
                        <div className="align-items-center d-flex justify-content-center">
                            <label htmlFor="color">Select Color:</label>
                            <input
                                type="color"
                                id="color"
                                className="mt-1 ms-3"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button
                            className="btn btn-primary mt-1"
                            disabled={elements.length === 0}
                            onClick={() => undo()}
                        >
                            UNDO
                        </button>

                        <button
                            className="btn btn-outline-primary mt-1"
                            disabled={history.length < 1}
                            onClick={() => redo()}
                        >
                            REDO
                        </button>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-danger" onClick={handelClearCanvas}>
                            Clear Canvas
                        </button>
                    </div>
                </div>
            )}

            <div className="col-md-10 mx-auto mt-4 canvas-box">
                <WhiteBoard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}
                    tool={tool}
                    user={user}
                    socket={socket}
                />
            </div>
        </div>
    );
};

export default RoomPage;