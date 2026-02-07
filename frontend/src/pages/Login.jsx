import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isSignup) {
        const { data } = await api.post('/auth/signup', { email: email.trim(), password, name: name.trim() });
        login(data.token, data.user);
        toast.success('Account created! Welcome.');
      } else {
        const { data } = await api.post('/auth/login', { email: email.trim(), password });
        login(data.token, data.user);
        toast.success('Logged in successfully.');
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || (isSignup ? 'Signup failed' : 'Login failed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-dark-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <h1 className="font-display text-2xl font-bold text-center text-white mb-1">
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          {isSignup ? 'Sign up to subscribe to courses' : 'Log in to access your courses'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white transition"
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignup(!isSignup); setErrors({}); }}
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>

      <p className="mt-6 text-center text-gray-500 text-xs">
        <Link to="/" className="hover:text-gray-400">← Back to Home</Link>
      </p>
    </div>
  );
}
