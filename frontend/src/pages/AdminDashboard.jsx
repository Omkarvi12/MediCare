import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.dashboard}>

      {/* ==========================
          HEADER
      ========================== */}

      <header style={styles.header}>

        <div>
          <h1 style={styles.logo}>MediCare Admin</h1>
          <p style={styles.subtitle}>
            Admin Dashboard
          </p>
        </div>

        <div style={styles.adminInfo}>

          <span>
            👤 {user?.name || "Admin"}
          </span>

          <span style={styles.badge}>
            ADMIN
          </span>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ==========================
          MAIN CONTENT
      ========================== */}

      <main style={styles.main}>

        <h2 style={styles.heading}>
          Welcome, {user?.name || "Admin"} 👋
        </h2>

        <p style={styles.description}>
          Manage MediCare products, orders and users from
          the admin panel.
        </p>


        {/* ==========================
            DASHBOARD CARDS
        ========================== */}

        <div style={styles.cardContainer}>

          {/* Products */}

          <div style={styles.card}>

            <div style={styles.icon}>
              📦
            </div>

            <h3>
              Products
            </h3>

            <p>
              Add, edit and manage medicine products.
            </p>

            <button
              style={styles.button}
              onClick={() => navigate("/admin/products")}
            >
              Manage Products
            </button>

          </div>


          {/* Orders */}

          <div style={styles.card}>

            <div style={styles.icon}>
              🛒
            </div>

            <h3>
              Orders
            </h3>

            <p>
              View and manage customer orders.
            </p>

            <button
              style={styles.button}
              onClick={() => navigate("/admin/orders")}
            >
              Manage Orders
            </button>

          </div>


          {/* Users */}

          <div style={styles.card}>

            <div style={styles.icon}>
              👥
            </div>

            <h3>
              Users
            </h3>

            <p>
              View registered MediCare users.
            </p>

            <button
              style={styles.button}
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </button>

          </div>


          {/* Profile */}

          <div style={styles.card}>

            <div style={styles.icon}>
              👤
            </div>

            <h3>
              Admin Profile
            </h3>

            <p>
              View your admin account information.
            </p>

            <button
              style={styles.button}
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ==========================
   STYLES
========================== */

const styles = {

  dashboard: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    color: "#172554",
  },

  header: {
    backgroundColor: "#ffffff",
    padding: "20px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
  },

  logo: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  badge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  logoutButton: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "9px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  main: {
    padding: "45px 50px",
  },

  heading: {
    fontSize: "32px",
    marginBottom: "8px",
  },

  description: {
    color: "#64748b",
    marginBottom: "35px",
  },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  button: {
    marginTop: "15px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

};

export default AdminDashboard;