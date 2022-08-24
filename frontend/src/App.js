import './App.css';
import io from "socket.io-client"
import { useState } from "react"
import Chat from "./Chat"

const socket = io.connect('http://localhost:4000')

function App() {

  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("JS")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (

    <div className="App">

      {!showChat ?
        <div className="join-chat-container">

          <h3>Join to chat</h3>
          <input type="text" value={username} id="username" placeholder="Username..." onChange={(e) => setUsername(e.target.value)} />
          <input type="text" value={room} id="room" placeholder="Room..." onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </div>
        : <Chat socket={socket} author={username} room={room} />
      }

    </div>
  );
}

export default App;
