import Forms from './components/forms';
import { Routes,Route } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';


const server="http://localhost:5000";

  const connectionOptions={
    "force new connection":true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

const App = () => {

   const [user, setUser] = useState(null);
  
  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("userJoined");
      }else{
        console.log("userJoined Error");
      }
    });
  },[]);

  

  const socket = io(server, connectionOptions);
 

  

  const uuid = () => {
    let S4 = () =>{
      return (((1+ Math.random()) * 0x10000 ) | 0).toString(16).substring(1);
    };
    return(
      S4()+S4()+ "_"+ S4()+ "_"+ S4()+ "_"+ S4()+ "_"+ S4()+S4()+S4()
    );
  };



  return (
    <div className='container'>
      <Routes>
        <Route path= "/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route path= "/:roomId" element={<RoomPage />} />
      </Routes>
     
     
    </div>
  );
};

export default App;