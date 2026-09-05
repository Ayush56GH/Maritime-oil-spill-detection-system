"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/app/(auth)/layout';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    // Mock authentication – in real app replace with API call
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <header className="signup-header">
        <Link href="/" className="signup-logo">
          <Compass size={28} color="#00d7b2" />
          <span>EcoNavigators</span>
        </Link>
      </header>

      <div className="signup-card">
        <h1 className="signup-title">Log In</h1>
        <p className="signup-subtitle">
          Access your dashboard to monitor marine intelligence.
        </p>

        {submitted ? (
          <div className="signup-success">
            <CheckCircle2 size={48} className="success-icon" />
            <h3>Welcome Back!</h3>
            <p>
              You have successfully logged in as <strong>{formData.email}</strong>.
            </p>
            <Link href="/" className="btn-primary-action">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="form-error-alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-terms flex items-center justify-between">
              <label className="terms-label">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="terms-checkbox"
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="link-terms text-sm">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-primary-action">
              Log In
            </button>
            <div className="signup-footer-text">
              Don't have an account?{' '}
            <Link href="/signup" className="login-link">
              Sign up
            </Link>
            </div>
          </form>
        )}
      </div>

    </AuthLayout>
  );
}
