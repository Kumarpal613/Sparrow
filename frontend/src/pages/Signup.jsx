import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { UserPlus } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.signup({ email, password });

      navigate("/verify-otp", {
        state: {
          email,
          token: response.signup_token,
        },
      });
    } catch (err) {
      const detail = err.response?.data.detail;

      if (detail?.message) {
        let message = detail.message;
        if (detail["retry after"]) {
          const minutes = Math.ceil(detail["retry after"] / 60);
          message += ` You can try again in ${minutes} minutes.`;
        }
        setError(message);
      } else if (detail?.detail) {
        setError(detail.detail);
      } else {
        setError("Failed to create an account. Please try again.");
      }
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
            background: "rgba(244, 114, 182, 0.1)",
            borderRadius: "50%",
            marginBottom: "1rem",
            color: "var(--secondary-color)",
          }}
        >
          <UserPlus size={32} />
        </div>
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Join Sparrow today to get started.</p>
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
          minLength={8}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Create Account
        </Button>
      </form>

      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
        }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ fontWeight: "500" }}>
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
