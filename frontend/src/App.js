import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://ec2-43-201-184-82.ap-northeast-2.compute.amazonaws.com:8080/chat");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // setMessages((prevMessages) => [...prevMessages, data.message]);
      setMessages((prevMessages) => [...prevMessages, data.message]);
      return false;
    };

    ws.onclose = () => console.log("WebSocket closed.");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setSocket(ws);
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket) {
      socket.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
