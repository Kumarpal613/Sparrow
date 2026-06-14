import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { CheckCircle2 } from "lucide-react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const state = location.state || {}; // might have email or resetToken
  const { email, token } = state; // token might be needed for Bearer auth

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authApi.verifySignupOtp({ otp }, token);
      setSuccess("Email verified successfully!");

      // Auto login or redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 400) {
        setError(detail || "The OTP you entered is incorrect.");
      } else if (status === 401) {
        setError(
          "Your verification session has expired. Please request a new OTP.",
        );
      } else if (status === 500) {
        setError("We encountered a server error. Please try again later.");
        console.error(err.response?.data);
      } else {
        setError(detail || "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResendLoading(true);
    setError("");
    setSuccess("");

    try {
      await authApi.resendSignupOtp(token);
      setSuccess("A new OTP has been sent to your email.");
      setCooldown(30);
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 400) {
        setError( "Failed to resend OTP. Please try again.");
      } else if (status === 401) {
        setError(
          "Your verification session has expired. Please request a new OTP.",
        );
      } else if (status === 500) {
        setError("We encountered a server error. Please try again later.");
        console.error(err.response?.data);
      } else {
        setError(detail || "Something went wrong.");
      } 
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <div className="auth-card glass-panel animate-fade-in">
      <div className="auth-header">
        <div
          style={{
            display: "inline-block",
            padding: "1rem",
            background: "rgba(34, 197, 94, 0.1)",
            borderRadius: "50%",
            marginBottom: "1rem",
            color: "var(--success-color)",
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h2 className="auth-title">Verify Email</h2>
        <p className="auth-subtitle">
          {email
            ? `We sent a code to ${email}`
            : "Enter the code sent to your email"}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          id="otp"
          type="text"
          label="Verification Code (OTP)"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter the 6-digit code"
          required
          style={{
            letterSpacing: "0.5rem",
            textAlign: "center",
            fontSize: "1.25rem",
          }}
          maxLength={6}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Verify Code
        </Button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <Button
          variant="ghost"
          onClick={handleResend}
          isLoading={isResendLoading}
          disabled={cooldown > 0}
          style={{ fontSize: "0.9rem" }}
        >
          {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
        </Button>
      </div>

      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
        }}
      >
        <Link to="/login" style={{ fontWeight: "500" }}>
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default VerifyOTP;
