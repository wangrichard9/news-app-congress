import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <Link to="/" className="login-button">
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
