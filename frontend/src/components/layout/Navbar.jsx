import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Sparkles, LogOut, User as UserIcon } from "lucide-react";
import Button from "../common/Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Sparkles size={24} color="#818cf8" />
        Sparrow
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            {user.role === "Admin" ? (
              <Link
                to="/dashboard"
                className="nav-link center-flex"
                style={{ flexDirection: "row", gap: "0.5rem" }}
              >
                <UserIcon size={18} />
                {user.email}
              </Link>
            ) : (
              <span
                className="nav-link center-flex"
                style={{
                  flexDirection: "row",
                  gap: "0.5rem",
                  color: "inherit",
                }}
              >
                <UserIcon size={18} />
                {user.email}
              </span>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              style={{ padding: "0.5rem" }}
            >
              <LogOut size={18} />
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
