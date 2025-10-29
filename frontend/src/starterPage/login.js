import React, { useState } from 'react';

const Login = () => {

    return (
        <div className="login-container">
        <div className="login-form">
            
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Your Email</label>
                <input
                type="email"
                name="email"
                placeholder="Email"
                required
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <div className="password-input">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                />
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