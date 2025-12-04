import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ conversation, messages, onSendMessage }) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const styles = {
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#0b0b0b",
    },
    header: {
      padding: "12px 16px",
      borderBottom: "1px solid #222",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerName: {
      fontWeight: "bold",
      fontSize: "15px",
    },
    headerSub: {
      fontSize: "12px",
      color: "#888",
    },
    messagesArea: {
      flex: 1,
      padding: "16px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    inputBar: {
      borderTop: "1px solid #222",
      padding: "10px 12px",
      display: "flex",
      gap: "8px",
      background: "#111",
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "20px",
      border: "1px solid #333",
      outline: "none",
      fontSize: "14px",
      background: "#1a1a1a",
      color: "#fff",
    },
    sendBtn: {
      padding: "0 16px",
      borderRadius: "20px",
      border: "none",
      background: "#0079d3",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
    },
    placeholder: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#777",
      fontSize: "14px",
    },
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  if (!conversation) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>Select a conversation to start chatting</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerName}>{conversation.name}</div>
          <div style={styles.headerSub}>Direct message</div>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={styles.messagesArea}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} fromMe={msg.fromMe} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <form style={styles.inputBar} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          placeholder="Send a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" style={styles.sendBtn}>
          Send
        </button>
      </form>
    </div>
  );
}
