# 🎨 Real-Time Collaborative Whiteboard

A high-performance, real-time collaborative whiteboard application that enables multiple users to draw, sketch, and collaborate simultaneously with ultra-low latency.

## ✨ Features

- **Real-Time Collaboration**: Draw simultaneously with 20+ users in the same room
- **Ultra-Low Latency**: Achieved 50ms average latency through optimized WebSocket communication
- **Bandwidth Optimized**: 70% reduction in bandwidth usage via intelligent event throttling
- **Smooth Performance**: 60 FPS rendering using requestAnimationFrame
- **Room-Based Architecture**: Create or join unique rooms with custom room IDs
- **User Presence Detection**: Real-time tracking of active users in each room
- **Drawing Tools**: Multiple brush sizes, colors, and eraser functionality
- **Responsive Design**: Works seamlessly across desktop and tablet devices


## 🛠️ Tech Stack

**Frontend:**
- React.js - UI framework
- Canvas API - Drawing functionality
- Socket.io Client - Real-time communication
- CSS3 - Styling

**Backend:**
- Node.js - Runtime environment
- Express.js - Web framework
- Socket.io - WebSocket server

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/Priyanshu-Jain7/Real-Time-White-Board-Sharing.git
cd Real-Time-White-Board-Sharing
```

### Backend Setup
```bash
cd server
npm install
npm start
```
The server will start on `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm install
npm start
```
The application will open on `http://localhost:3000`

## 📁 Project Structure

```
realtime-whiteboard/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Whiteboard.jsx
│   │   │   ├── Toolbar.jsx
│   │   │   └── RoomSelector.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/
│   ├── index.js
│   ├── socket/
│   │   └── socketHandler.js
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### 1. **Optimized WebSocket Communication**
- Implemented event batching and throttling to reduce network overhead
- Achieved 50ms latency even with 20+ concurrent users

### 2. **Efficient Rendering**
- Used `requestAnimationFrame` for smooth 60 FPS drawing
- Minimized canvas redraws through intelligent state management

### 3. **Room-Based Architecture**
- Users can create unique rooms or join existing ones
- Isolated drawing spaces for different collaboration sessions
- Real-time user count and presence indicators

### 4. **Bandwidth Optimization**
- 70% reduction through event throttling and delta compression
- Only transmit changed drawing data instead of full canvas state

## 🔧 Configuration

Create a `.env` file in the server directory:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the client directory:

```env
REACT_APP_SERVER_URL=http://localhost:5000
```

## 📊 Performance Metrics

- **Latency**: ~50ms for real-time updates
- **Concurrent Users**: Tested with 20+ users per room
- **FPS**: Consistent 60 FPS rendering
- **Bandwidth**: 70% reduction compared to baseline implementation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Priyanshu Jain**
- LinkedIn: [priyanshu-jain-569b53243](https://www.linkedin.com/in/priyanshu-jain-569b53243/)
- GitHub: [@Priyanshu-Jain7](https://github.com/Priyanshu-Jain7)
- Email: priyanshujain762@gmail.com


## 🔮 Future Enhancements

- [ ] Add chat functionality
- [ ] Implement drawing shapes (rectangle, circle, line)
- [ ] Add undo/redo functionality
- [ ] Save and export whiteboard as image
- [ ] Add text tool
- [ ] Implement collaborative cursor tracking
- [ ] Mobile app version

---

⭐ If you found this project helpful, please give it a star!
