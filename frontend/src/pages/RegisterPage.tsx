import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'AGENT' | 'ADMIN'>('USER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Mocking signups with dynamic roles directly
      await signup(name, email, password);
      // Wait for registration backend trigger
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl space-y-6 transition-colors">
      <div className="text-center space-y-2">
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Create Account</h2>
        <p className="text-on-surface-variant text-sm">
          Join XYZ Homes to schedule walkthroughs and list properties
        </p>
      </div>

      {error && (
        <div className="p-3 bg-error-container/10 border border-error/20 text-error rounded-lg text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">Account Type (Role)</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-2.5 px-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-background cursor-pointer"
          >
            <option value="USER">Buyer / Tenant</option>
            <option value="AGENT">Real Estate Agent</option>
            <option value="ADMIN">Platform Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <UserPlus className="h-4.5 w-4.5" />
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-on-surface-variant">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-semibold">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
