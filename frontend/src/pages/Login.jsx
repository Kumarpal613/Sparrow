import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : "Failed to log in. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card glass-panel animate-fade-in">
      <div className="auth-header">
        <div
          style={{
            display: "inline-block",
            padding: "1rem",
            background: "rgba(129, 140, 248, 0.1)",
            borderRadius: "50%",
            marginBottom: "1rem",
            color: "var(--primary-color)",
          }}
        >
          <LogIn size={32} />
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Enter your credentials to access your account
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "-0.5rem 0 1.5rem 0",
          }}
        >
          <Link to="/forgot-password" style={{ fontSize: "0.85rem" }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} style={{ width: "100%" }}>
          Sign In
        </Button>
      </form>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      > 
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
        }}
      >
        Don't have an account?{" "}
        <Link to="/signup" style={{ fontWeight: "500" }}>
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
