import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_2k.png';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and admin info in localStorage
      localStorage.setItem('adminToken', data.token);
      if (data.admin) {
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      }

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="2K Overalls" className="h-14 w-14 object-contain" />
          <h1 className="mt-4 font-display text-2xl uppercase tracking-wide text-bone">Command Center</h1>
          <p className="mt-1 text-sm text-bone-dim">Sign in to manage 2K Overalls</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-ink-line bg-ink-soft p-6">
          {error && (
            <div className="mb-4 border border-down/30 bg-down/10 px-3 py-2 text-sm text-down">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink-line bg-ink px-3 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
                placeholder="you@2koveralls.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink-line bg-ink px-3 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full border border-brand bg-brand py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
