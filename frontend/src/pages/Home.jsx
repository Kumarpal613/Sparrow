import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="center-flex" style={{ minHeight: '80vh', textAlign: 'center' }}>
            <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Welcome to Sparrow
            </h1>
            
            {!user && (
                <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', animationDelay: '0.2s' }}>
                    <Link to="/signup">
                        <Button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Log In
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
