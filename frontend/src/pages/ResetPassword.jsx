import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResendLoading, setIsResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    React.useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const [isVerified, setIsVerified] = useState(false); // Step 1: Verify OTP, Step 2: Set Password
    // Alternatively we can just send OTP and new password at once if the backend supports it, 
    // but looking at OpenAPI:
    // /auth/password-recovery/verify takes VerifyOTPRequest
    // /auth/password-recovery/reset takes ResetPasswordReq {token, new_password}

    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    let { email, token } = state;

    if (!token) {
        // fallback token if not provided by request password route
        token = "";
    }

    const [resetToken, setResetToken] = useState(token); // To store the token that reset needs

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // API needs Bearer token which should have been set via location state or similar.
            // If none, the OTP verify might fail or we might need the OTP API to work differently.
            // Assuming Verify returns a token for the actual reset step.
            const res = await authApi.verifyRecoveryOtp({ otp }, resetToken);
            setIsVerified(true);
            if (res.token || res.access_token) {
                setResetToken(res.token || res.access_token);
            }
            setSuccess('Recovery code verified! Now set a new password.');
        } catch (err) {
            setError('Invalid recovery code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setIsResendLoading(true);
        setError('');
        setSuccess('');

        try {
            await authApi.resendRecoveryOtp(resetToken);
            setSuccess('A new recovery code has been sent to your email.');
            setCooldown(30);
        } catch (err) {
            if (err.response?.data?.detail) {
                setError(
                    typeof err.response.data.detail === 'string'
                        ? err.response.data.detail
                        : JSON.stringify(err.response.data.detail)
                );
            } else {
                setError('Failed to resend recovery code. Please try again.');
            }
        } finally {
            setIsResendLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // reset password expects token and new_password
            await authApi.resetPassword({ token: resetToken, new_password: newPassword });
            setSuccess('Password reset successfully! Redirecting...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            if (err.response?.data?.detail) {
                setError(JSON.stringify(err.response.data.detail));
            } else {
                setError('Failed to reset password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card glass-panel animate-fade-in">
            {!isVerified ? (
                <>
                    <div className="auth-header">
                        <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary-hover)' }}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="auth-title">Verify Recovery code</h2>
                        <p className="auth-subtitle">
                            {email ? `Enter the code sent to ${email}` : 'Enter your recovery code'}
                        </p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleVerify}>
                        <Input
                            id="otp"
                            type="text"
                            label="Recovery Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            required
                            style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }}
                        />

                        <Button type="submit" isLoading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
                            Verify Code
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={handleResend}
                            isLoading={isResendLoading}
                            disabled={cooldown > 0}
                            style={{ fontSize: '0.9rem' }}
                        >
                            {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="auth-header">
                        <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--success-color)' }}>
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="auth-title">Set New Password</h2>
                        <p className="auth-subtitle">Create a new, strong password</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleReset}>
                        <Input
                            id="newPassword"
                            type="password"
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />

                        <Button type="submit" isLoading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
                            Reset Password
                        </Button>
                    </form>
                </>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ fontWeight: '500' }}>Back to login</Link>
            </div>
        </div>
    );
};

export default ResetPassword;
