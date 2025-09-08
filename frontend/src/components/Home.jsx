import { useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs.js";
import { Client } from "@stomp/stompjs";
import "../assets/Home.css";

const Home = ({ setPage }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState("");

  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsHost = "localhost:8080"; // change to your backend host in production
  const wsEndpoint = `${wsProtocol}://${wsHost}/ws`;

  // Fetch current user info
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/userdata", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const user = await res.json();
        setUsername(user.username);
      }
    } catch (err) {
      console.error(err);
      setUsername("");
    }
  };

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:8080/message/all_messages", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMessages();

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        client.subscribe("/topic/messages", (msg) => {
          if (msg.body) {
            const newMsg = JSON.parse(msg.body);
            setMessages((prev) =>
              prev.some((m) => m.messageId === newMsg.messageId)
                ? prev
                : [newMsg, ...prev]
            );
          }
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  useEffect(() => {
    const container = document.getElementById("all-message-view");
    if (container) container.scrollTop = 0;
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/message/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      await res.json();
      if (res.ok) {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="home">
      {username ? (
        <h1>{`Hello, ${username}`}</h1>
      ) : (
        <button onClick={() => setPage("login")}>Login</button>
      )}

      <div id="all-message-view">
        {messages.map((msg) => (
          <div key={msg.messageId} className="card">
            <h3>{msg.username}</h3>
            <div className="message">
              <h2>{msg.title}</h2>
              <hr id="t-hr" />
              <p>{msg.content}</p>
              <small className="created-at">
                {new Date(msg.createdAt).toLocaleString()}
                {msg.edited && " (edited)"}
              </small>
            </div>
            <hr />
          </div>
        ))}
      </div>

      <div id="create-message">
        <form onSubmit={handleSubmit}>
          <div id="title-and-post">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <button type="submit">Post</button>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          ></textarea>
        </form>
      </div>
    </div>
  );
};

export default Home;
