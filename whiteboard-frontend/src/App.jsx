import Forms from './components/forms';
import { Routes,Route } from 'react-router-dom';
import RoomPage from './pages/RoomPage';


const App = () => {
  return (
    <div className='container'>
      <Routes>
        <Route path= "/" element={<Forms />} />
        <Route path= "/:roomId" element={<RoomPage />} />
      </Routes>
     
     
    </div>
  );
};

export default App;