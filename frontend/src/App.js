import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import ItemsList from './components/ItemsList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ username: 'User' });
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthMode('login');
  };

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <ItemsList user={user} onLogout={handleLogout} />
      ) : (
        <>
          {authMode === 'login' ? (
            <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
          ) : (
            <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
          )}
        </>
      )}
    </div>
  );
}

export default App;