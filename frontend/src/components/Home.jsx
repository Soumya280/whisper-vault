import { useEffect, useState } from "react";

const Home = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const result = await fetch("http://localhost:8080/message/all_messages", {
        method: "GET",
        credentials: "include",
      });

      const all_messages = await result.json();

      if (result.ok) {
        setMessages(all_messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("http://localhost:8080/message/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      const createMessage = await result.json();

      if (result.ok) {
        console.log(createMessage.createMessage);
      } else if (result.status === 400) {
        console.log(createMessage.createMessage);
      } else if (result.status === 401) {
        console.log(createMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="home">
      <h1>Home</h1>
      <div id="create-message">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
      <div id="all-message-view">
        {messages.map((msg) => (
          <div key={msg.messageId} className="message">
            <h3>{msg.title}</h3>
            <p>{msg.content}</p>
            <small>
              Posted by <strong>{msg.username}</strong> at{" "}
              {new Date(msg.createdAt).toLocaleString()}
              {msg.edited && " (edited)"}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
