import "./index.css";
import CreateRoomForm from "./createRoomform";
import JoinRoomForm from "./joiniRoomform";

const Forms = () => {
  return (
    <div className="row h-100% pt-10">
        <div className="col-md-4 mt-5 form-box border border-5 p-5 mx-auto d-flex flex-column align-items-center rounded-4">
            <h1 className="text-primary fw-bold">Create Room</h1>
            <CreateRoomForm />
        </div>
        <div className="col-md-4 mt-5 form-box border border-5 p-5 mx-auto d-flex flex-column align-items-center rounded-4">
            <h1 className="text-primary fw-bold">Join Room</h1>
            <JoinRoomForm />
        </div>
    </div>
  );

};

export default Forms;