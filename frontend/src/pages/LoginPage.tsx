import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldCheck, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(`/${redirect}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMockLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Trigger a mock OAuth authentication login session
      await googleLogin('john.doe@google.com', 'John Doe');
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(`/${redirect}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl space-y-6 transition-colors">
      <div className="text-center space-y-2">
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Admin Panel Login</h2>
        <p className="text-on-surface-variant text-sm">
          Enter your credentials to access the property dashboard
        </p>
      </div>

      {searchParams.get('expired') === 'true' && (
        <div className="p-3 bg-error-container/10 border border-error/20 text-error rounded-lg text-xs font-semibold text-center">
          Your session expired. Please log in again.
        </div>
      )}

      {error && (
        <div className="p-3 bg-error-container/10 border border-error/20 text-error rounded-lg text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">Admin Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@xyzhomes.com"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-on-surface-variant">Password</label>
          </div>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <LogIn className="h-4.5 w-4.5" />
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
