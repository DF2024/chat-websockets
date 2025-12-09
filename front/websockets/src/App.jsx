import io from 'socket.io-client'
import { useState, useEffect } from 'react'
import './App.css'

// Conexión con el backend
const socket = io.connect("http://localhost:5000")


function App() {
  // Estados para el formulario y mensajes
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  // Estado para el mensaje actual y la lista
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const joinRoom = () => {
    if(username !== "" && room !== ""){
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }

  const sendMessage = async () => {
    if(currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage, 
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      }

      await socket.emit("send_message",messageData)

      // Agregamos nuestro propio mensaje a la lista
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("")
    }
  }

  useEffect(()=>{
    // Escuchar el evento cuando el servidor envia un mensaje
    const receiveMessage = (data) => {
      setMessageList((list) => [...list, data])
    }

    // Escuchar el historial de mensajes al entrar (Nuevo)
    const loadMessages = (messages) => {
      setMessageList(messages)
    }

    socket.on("receive_message", receiveMessage)
    socket.on("load_messages", loadMessages) // Registramos el evento

    return () => {
      socket.off("receive_message", receiveMessage)
      socket.off("load_messages", loadMessages) // Limpiamos el evento
    }
  }, [socket])


  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Unirse al Chat</h3>
          <input
            type="text"
            placeholder="Tu nombre..."
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="ID de Sala..."
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Entrar</button>
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <p>Sala: {room}</p>
          </div>
          <div className="chat-body">
              {messageList.map((messageContent, index) => {
                return (
                  <div
                    className="message"
                    id={username === messageContent.author ? "you" : "other"}
                    key={index}
                  >
                    <div>
                      <div className="message-content">
                        <p>{messageContent.message}</p>
                      </div>
                      <div className="message-meta">
                        <p id="time">{messageContent.time}</p>
                        <p id="author">{messageContent.author}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={currentMessage}
              placeholder="Escribe un mensaje..."
              onChange={(event) => setCurrentMessage(event.target.value)}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}>&#9658;</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
