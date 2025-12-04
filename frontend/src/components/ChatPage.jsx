import { useState } from "react";

export default function ChatPage() {
  const [showNewChat, setShowNewChat] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#000",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000, // ensures chat page is ABOVE header/sidebar
      }}
    >
      {/* LEFT CHAT LIST */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid #333",
          padding: "20px",
          background: "#0f0f0f",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Chats</h2>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: "bold" }}>JohnDoe</div>
          <div style={{ fontSize: "13px", color: "#aaa" }}>Hey, what's up?</div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: "bold" }}>Sarah</div>
          <div style={{ fontSize: "13px", color: "#aaa" }}>
            Did you see this meme?
          </div>
        </div>

        <div>
          <div style={{ fontWeight: "bold" }}>Backend Team</div>
          <div style={{ fontSize: "13px", color: "#aaa" }}>Meeting at 4pm</div>
        </div>
      </div>

      {/* RIGHT EMPTY STATE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0f",
        }}
      >
        <img
          src="public/snoo.png"
          alt="snoo"
          style={{ width: "170px", marginBottom: "20px", opacity: 0.9 }}
        />

        <h1 style={{ marginBottom: "10px" }}>Welcome to chat!</h1>

        <p style={{ marginBottom: "30px", color: "#ccc" }}>
          Start a direct or group chat with other redditors.
        </p>

        <button
          onClick={() => setShowNewChat(true)}
          style={{
            padding: "14px 30px",
            background: "#0079d3",
            borderRadius: "30px",
            color: "white",
            fontSize: "17px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>➕</span>
          Start new chat
        </button>
      </div>

      {/* SLIDE-IN NEW CHAT PANEL */}
      {showNewChat && (
        <div
          style={{
            position: "fixed", // <-- FIXED SO IT APPEARS ABOVE EVERYTHING
            top: 0,
            right: 0,
            width: "420px",
            height: "100%",
            background: "#111",
            borderLeft: "1px solid #333",
            zIndex: 4000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* TOP BAR */}
          <div
            style={{
              padding: "18px",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            New Chat

            <div style={{ display: "flex", gap: "12px", cursor: "pointer" }}>
              <span title="Pop-out" style={{ fontSize: "20px" }}>↗</span>
              <span title="Minimize" style={{ fontSize: "20px" }}>⌄</span>
              <span
                title="Close"
                onClick={() => setShowNewChat(false)}
                style={{ fontSize: "22px" }}
              >
                ✕
              </span>
            </div>
          </div>

          {/* INPUT */}
          <div style={{ padding: "20px" }}>
            <div
              style={{
                border: "1px solid #555",
                borderRadius: "12px",
                padding: "16px",
                background: "#1a1a1a",
                marginBottom: "10px",
              }}
            >
              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Type username(s) *"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ fontSize: "13px", color: "#aaa" }}>
              Search for people by username to chat with them.
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: "auto",
              padding: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              borderTop: "1px solid #333",
            }}
          >
            <button
              onClick={() => setShowNewChat(false)}
              style={{
                padding: "10px 20px",
                background: "#222",
                borderRadius: "20px",
                color: "white",
                border: "1px solid #444",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              disabled={!usernameInput.trim()}
              style={{
                padding: "10px 20px",
                background: usernameInput.trim() ? "#0079d3" : "#444",
                borderRadius: "20px",
                color: "white",
                border: "none",
                cursor: usernameInput.trim() ? "pointer" : "not-allowed",
                opacity: usernameInput.trim() ? 1 : 0.5,
              }}
            >
              Start Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
