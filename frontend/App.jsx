import React, { useState } from "react";

const API_URL = "https://rallygram-backend.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("username") || ""
  );

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chats = [
    {
      name: "Rallygram Updates",
      last: "Welcome to your new social app!",
      time: "Now",
      avatar: "R",
    },
    {
      name: "Friends Group",
      last: "Create groups like Telegram.",
      time: "10:30",
      avatar: "F",
    },
    {
      name: "My Channel",
      last: "Post updates for followers.",
      time: "09:15",
      avatar: "C",
    },
  ];

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("Username और password दोनों भरो");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || data.error || "Something went wrong");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username || username);

        setToken(data.token);
        setCurrentUser(data.username || username);
      } else {
        setMessage("Account created. अब login करो.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage("Backend connect नहीं हो रहा. URL या server check करो.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setCurrentUser("");
  };

  if (!token) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <h1 style={styles.authLogo}>Rallygram</h1>
          <p style={styles.authText}>
            Fast, secure and simple social messaging app
          </p>

          <form onSubmit={handleAuth}>
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {message && <p style={styles.message}>{message}</p>}

            <button style={styles.authButton} type="submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <button
            style={styles.switchButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin
              ? "New user? Create account"
              : "Already have account? Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.topBar}>
        <div>
          <h1 style={styles.logo}>Rallygram</h1>
          <p style={styles.logged}>@{currentUser}</p>
        </div>

        <button style={styles.logoutSmall} onClick={logout}>
          Logout
        </button>
      </header>

      <main style={styles.container}>
        <div style={styles.searchBox}>Search chats, groups, channels...</div>

        <section style={styles.quickGrid}>
          <div style={styles.quickBox}>
            <span style={styles.quickIcon}>💬</span>
            <p>Chats</p>
          </div>

          <div style={styles.quickBox}>
            <span style={styles.quickIcon}>👥</span>
            <p>Groups</p>
          </div>

          <div style={styles.quickBox}>
            <span style={styles.quickIcon}>📢</span>
            <p>Channels</p>
          </div>

          <div style={styles.quickBox}>
            <span style={styles.quickIcon}>👤</span>
            <p>Profile</p>
          </div>
        </section>

        <h2 style={styles.sectionTitle}>Messages</h2>

        <section style={styles.chatList}>
          {chats.map((chat, index) => (
            <div style={styles.chatItem} key={index}>
              <div style={styles.avatar}>{chat.avatar}</div>

              <div style={styles.chatInfo}>
                <div style={styles.chatTop}>
                  <h3>{chat.name}</h3>
                  <span>{chat.time}</span>
                </div>
                <p>{chat.last}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <button style={styles.floatingButton}>+</button>

      <nav style={styles.bottomNav}>
        <div>💬<br />Chats</div>
        <div>📢<br />Channels</div>
        <div>👤<br />Profile</div>
      </nav>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "80px",
  },
  topBar: {
    background: "#229ed9",
    color: "white",
    padding: "24px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
  },
  logged: {
    margin: "6px 0 0",
    fontSize: "15px",
    opacity: 0.9,
  },
  logoutSmall: {
    background: "white",
    color: "#229ed9",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: "700",
  },
  container: {
    padding: "18px",
  },
  searchBox: {
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    color: "#777",
    fontSize: "16px",
    marginBottom: "18px",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "24px",
  },
  quickBox: {
    background: "white",
    borderRadius: "18px",
    padding: "14px 8px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "700",
  },
  quickIcon: {
    fontSize: "24px",
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "12px",
  },
  chatList: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderBottom: "1px solid #eee",
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "#229ed9",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "800",
  },
  chatInfo: {
    flex: 1,
  },
  chatTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  floatingButton: {
    position: "fixed",
    right: "22px",
    bottom: "88px",
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    border: "none",
    background: "#229ed9",
    color: "white",
    fontSize: "34px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
  },
  bottomNav: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    background: "white",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    borderTop: "1px solid #ddd",
    fontSize: "13px",
    fontWeight: "700",
  },
  authPage: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #229ed9, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  authCard: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },
  authLogo: {
    textAlign: "center",
    color: "#229ed9",
    fontSize: "38px",
    margin: 0,
  },
  authText: {
    textAlign: "center",
    color: "#666",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  message: {
    color: "red",
    fontSize: "14px",
  },
  authButton: {
    width: "100%",
    background: "#229ed9",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "16px",
    fontSize: "18px",
    fontWeight: "800",
  },
  switchButton: {
    width: "100%",
    marginTop: "14px",
    background: "transparent",
    color: "#229ed9",
    border: "none",
    fontSize: "16px",
    fontWeight: "700",
  },
};

export default App;
