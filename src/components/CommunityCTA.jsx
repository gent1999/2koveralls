import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const INSTAGRAM_URL = 'https://www.instagram.com/2k_overalls';

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Final homepage CTA — newsletter signup + Instagram, homepage-only (not the
// shared Footer, which stays limited to the link bar + copyright).
export default function CommunityCTA({ thumbnails = [] }) {
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
        body: JSON.stringify({ email, source: 'homepage' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Something went wrong. Please try again.');
      setStatus('ok');
      setMessage(data.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-ink-line">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border border-ink-line bg-ink-soft">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* NEWSLETTER */}
            <div className="p-6 lg:border-b-0 lg:border-r lg:border-ink-line">
              <h2 className="font-display text-xl uppercase tracking-wide text-bone sm:text-2xl">
                Join the 2K Community
              </h2>
              <p className="mt-1 text-sm text-bone-dim">
                Ratings, debates, new drops, and everything moving rap.
              </p>
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2 sm:max-w-md sm:flex-row">
                <label htmlFor="community-cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="community-cta-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="w-full flex-1 border border-ink-line bg-ink px-3 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 border border-brand bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50"
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </form>
              {status && (
                <p className={`mt-2 text-xs ${status === 'ok' ? 'text-up' : 'text-down'}`}>{message}</p>
              )}
            </div>

            {/* INSTAGRAM */}
            <div className="border-t border-ink-line p-6 lg:border-t-0">
              <h2 className="font-display text-xl uppercase tracking-wide text-bone sm:text-2xl">
                @2koveralls
              </h2>
              <p className="mt-1 text-sm text-bone-dim">
                Follow for daily ratings, debates, drops, and updates.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-bone focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <InstagramIcon className="h-4 w-4" />
                Follow on Instagram →
              </a>

              {thumbnails.length > 0 && (
                <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto">
                  {thumbnails.map((t) => (
                    <a
                      key={t.id}
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.title} on Instagram`}
                      className="h-14 w-14 flex-shrink-0 overflow-hidden border border-ink-line transition-colors hover:border-brand sm:h-16 sm:w-16"
                    >
                      <img
                        src={t.image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
