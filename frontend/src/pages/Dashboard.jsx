import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { authApi } from '../api/auth';
import { Shield, Smartphone, Clock, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogoutAll = async () => {
        setIsLoggingOutAll(true);
        setError('');
        setSuccess('');

        try {
            await authApi.logoutAll();
            setSuccess('Logged out of all devices successfully.');
            setTimeout(() => {
                logout();
            }, 1500);
        } catch (e) {
            setError('Failed to log out of all devices.');
        } finally {
            setIsLoggingOutAll(false);
        }
    };

    if (!user) {
       return null;
    }
    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back to Sparrow, {user.email || 'User'}</p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Profile Info Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '0.5rem', color: 'var(--primary-hover)' }}>
                            <Shield size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Account Status</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email</div>
                            <div style={{ fontWeight: '500' }}>{user.email}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success-color)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '600' }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--success-color)', borderRadius: '50%' }}></div>
                                {user.is_active ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Joined</div>
                            <div style={{ fontWeight: '500' }}>{new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                {/* Security Settings Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(244, 114, 182, 0.1)', borderRadius: '0.5rem', color: 'var(--secondary-color)' }}>
                            <Smartphone size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Device Management</h3>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Manage your active sessions and devices. You can sign out of all other devices if you notice suspicious activity.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '0.5rem' }}>
                                <Clock size={20} color="var(--primary-color)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>Current Session</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Windows • Valid</div>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleLogoutAll}
                            isLoading={isLoggingOutAll}
                            style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--error-color)' }}
                        >
                            <LogOut size={16} />
                            Sign Out All Devices
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
