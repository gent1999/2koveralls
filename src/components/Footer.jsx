import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_2k.png';

const API_URL = import.meta.env.VITE_API_URL;

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/submit-music', label: 'Submit Music' },
  { to: '/dmca', label: 'DMCA' },
  { to: '/terms', label: 'Terms of Use' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'ok' | 'error' | null
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setStatus('ok');
      setMessage(data.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-brand bg-ink">
      {/* Community CTA */}
      <div className="border-b border-ink-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-bone">Join the Board</h3>
              <p className="mt-1 text-sm text-bone-dim">
                New ratings, rankings, and rap culture coverage — straight to your inbox.
              </p>
              <a
                href="https://www.instagram.com/2k_overalls"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-bone"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @2k_overalls
              </a>
            </div>

            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm flex-col gap-2 sm:w-auto">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 border border-l-0 border-brand bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim disabled:opacity-50"
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </div>
              {status && (
                <p className={`text-xs ${status === 'ok' ? 'text-up' : 'text-down'}`}>{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-center text-xs font-medium text-bone-dim transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 border-t border-ink-line pt-3">
          <Link to="/">
            <img src={logo} alt="2K Overalls" className="h-5" />
          </Link>
          <p className="text-xs text-bone-dim">
            &copy; {new Date().getFullYear()} 2koveralls. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
