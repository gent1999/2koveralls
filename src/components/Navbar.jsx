import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo_2k.png';
import { generateNewsUrl } from '../utils/slugify';

const API_URL = import.meta.env.VITE_API_URL;

const NAV_LINKS = [
  { to: '/overalls', label: 'Overalls' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/news', label: 'Articles' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/about', label: 'About' },
];

function SearchBox({ onNavigate, mobile = false }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&site=lowkeygrid`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results && (results.overalls?.length || results.articles?.length || results.playlists?.length);

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search artists, articles, playlists..."
          className="w-full border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
        />
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {open && query.trim() && (
        <div className={`absolute ${mobile ? 'left-0 right-0' : 'right-0 w-80'} top-full z-50 mt-2 max-h-96 overflow-y-auto border border-ink-line bg-ink-raised shadow-xl`}>
          {!hasResults ? (
            <p className="p-4 text-sm text-bone-dim">No results found.</p>
          ) : (
            <>
              {results.overalls?.length > 0 && (
                <div className="border-b border-ink-line p-2">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">Artist</p>
                  {results.overalls.map((o) => (
                    <Link key={o.id} to={`/overalls/${o.slug}`} onClick={onNavigate} className="flex items-center justify-between px-2 py-2 text-sm text-bone hover:bg-ink-soft">
                      <span className="font-bold">{o.title}</span>
                      {typeof o.overall === 'number' && <span className="text-bone-dim">{o.overall} OVR</span>}
                    </Link>
                  ))}
                </div>
              )}
              {results.articles?.length > 0 && (
                <div className="border-b border-ink-line p-2">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">Article</p>
                  {results.articles.map((a) => (
                    <Link key={a.id} to={generateNewsUrl(a.id, a.title)} onClick={onNavigate} className="block px-2 py-2 text-sm text-bone line-clamp-1 hover:bg-ink-soft">
                      {a.title}
                    </Link>
                  ))}
                </div>
              )}
              {results.playlists?.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">Playlist</p>
                  {results.playlists.map((p) => (
                    <a key={p.id} href={p.spotify_url} target="_blank" rel="noopener noreferrer" className="block px-2 py-2 text-sm text-bone hover:bg-ink-soft">
                      {p.title}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-brand bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex flex-shrink-0 items-center">
            <img src={logo} alt="2K Overalls" className="h-9 md:h-10" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-bold uppercase tracking-wide text-bone-dim transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden w-64 flex-shrink-0 md:block">
            <SearchBox />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-bone hover:text-brand md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-ink-line pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-1 py-2 text-sm font-bold uppercase tracking-wide text-bone-dim hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2">
                <SearchBox mobile onNavigate={() => setIsMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
