import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // login logic goes here
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <h1>Idk some Newsapp</h1>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="form-group">
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <a href="#" className="forgot-link">Forgot your password? Skill Issue</a>

          <button type="submit" className="signin-button">
            ↓ Sign In
          </button>

          <div className="signup-link">
            <Link to="/signup">Create your free account now!</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
