import React from "react";

function App() {
  const username = localStorage.getItem("username") || "abhityr09";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Rallygram</h1>
      </header>

      <main style={styles.container}>
        <section style={styles.card}>
          <h2 style={styles.title}>Welcome to Rallygram</h2>
          <p style={styles.user}>Logged in as @{username}</p>
          <p style={styles.success}>
            Authentication system connected with backend successfully.
          </p>
        </section>

        <section style={styles.dashboard}>
          <h3 style={styles.sectionTitle}>Your Rallygram Dashboard</h3>

          <div style={styles.grid}>
            <div style={styles.box}>
              <span style={styles.icon}>💬</span>
              <h4>Chats</h4>
              <p>Start private conversations</p>
            </div>

            <div style={styles.box}>
              <span style={styles.icon}>📢</span>
              <h4>Channels</h4>
              <p>Create public channels</p>
            </div>

            <div style={styles.box}>
              <span style={styles.icon}>👥</span>
              <h4>Groups</h4>
              <p>Build your community</p>
            </div>

            <div style={styles.box}>
              <span style={styles.icon}>👤</span>
              <h4>Profile</h4>
              <p>Manage your account</p>
            </div>
          </div>
        </section>

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#25a7df",
    padding: "28px 20px",
    textAlign: "center",
  },
  logo: {
    margin: 0,
    color: "white",
    fontSize: "34px",
    fontWeight: "800",
  },
  container: {
    padding: "28px 18px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  card: {
    background: "#f4f6fb",
    borderRadius: "22px",
    padding: "28px 22px",
    marginBottom: "22px",
  },
  title: {
    fontSize: "30px",
    marginBottom: "20px",
    color: "#111",
  },
  user: {
    fontSize: "22px",
    color: "#111",
    marginBottom: "14px",
  },
  success: {
    fontSize: "18px",
    color: "#666",
    lineHeight: "1.4",
  },
  dashboard: {
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  },
  box: {
    background: "#f4f6fb",
    borderRadius: "18px",
    padding: "18px",
    textAlign: "center",
  },
  icon: {
    fontSize: "30px",
  },
  logout: {
    width: "100%",
    marginTop: "24px",
    background: "#ff3b35",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "18px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default App;
