import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { KeyRound } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authApi.requestPasswordRecovery({ email });
            setIsSuccess(true);
            // Let user verify the OTP on the Reset Password flow
            setTimeout(() => {
                navigate('/reset-password', { state: { email, token: response.token } });
            }, 3000);
        } catch (err) {
            if (err.response?.data?.detail) {
                setError(
                    typeof err.response.data.detail === 'string'
                        ? err.response.data.detail
                        : JSON.stringify(err.response.data.detail)
                );
            } else {
                setError('Failed to send recovery request. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card glass-panel animate-fade-in">
            <div className="auth-header">
                <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary-hover)' }}>
                    <KeyRound size={32} />
                </div>
                <h2 className="auth-title">Forgot Password</h2>
                <p className="auth-subtitle">Enter your email to receive a recovery code</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {isSuccess && <div className="alert alert-success">Recovery code sent! Redirecting...</div>}

            {!isSuccess && (
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

                    <Button type="submit" isLoading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
                        Send Recovery Code
                    </Button>
                </form>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Remember your password? <Link to="/login" style={{ fontWeight: '500' }}>Log in</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
