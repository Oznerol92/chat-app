import React, { useState, useEffect } from "react"
import socketIOClient from "socket.io-client"
import './App.css'
const ENDPOINT = "https://tksbalti.uk/"
const socket = socketIOClient()

function App() {
  const [response, setResponse] = useState("")
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on("FromAPI", data => {
      setResponse(data)
    })

    socket.on("message", ({sentBy, text}) => {
      setChat([...chat, {sentBy, text}])
    })

  }, [chat])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const sendMessage = () => {
    socket.emit("message", {sentBy: Math.round(Math.random(0,10)*10, 1), text: message})
    setMessage('')
  }

  return (
    <div className="App">
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
      <span>
        <input
          onChange={handleChange}
          value={message}
        ></input>
        <button
          onClick={sendMessage}
        >
          Send
        </button>
      </span><br/>
      <span>
        {chat.length !== 0 ? chat.map((msg, index) => (
          <p key={index}>
            {msg.sentBy}: {msg.text}
          </p>
        )) : <p>Send a message</p>}
      </span>
    </div>
  )
}

export default App
