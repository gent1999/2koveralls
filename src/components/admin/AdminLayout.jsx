import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo_2koveralls.png';
import { Icon } from './ui';

// Each item's `match` decides whether it highlights for the current path —
// explicit per-item rather than generic prefix-matching so sibling routes
// sharing a prefix (e.g. /admin/overalls and /admin/overalls/create) don't
// both light up at once.
const NAV_GROUPS = [
  ['Content', [
    { label: 'New Overall', icon: 'add', to: '/admin/overalls/create', match: (p) => p === '/admin/overalls/create' },
    { label: 'All Overalls', icon: 'overall', to: '/admin/overalls', match: (p) => p === '/admin/overalls' || p.startsWith('/admin/overalls/edit') },
    { label: 'New Article', icon: 'add', to: '/admin/writeups/create', match: (p) => p === '/admin/writeups/create' },
    { label: 'All Articles', icon: 'article', to: '/admin/writeups', match: (p) => p === '/admin/writeups' || p.startsWith('/admin/writeups/edit') },
    { label: 'New Trend', icon: 'add', to: '/admin/articles/create', match: (p) => p === '/admin/articles/create' },
    { label: 'All Trends', icon: 'list', to: '/admin/articles', match: (p) => p === '/admin/articles' || p.startsWith('/admin/articles/edit') },
  ]],
  ['Config', [
    { label: 'Spotify Manager', icon: 'spotify', to: '/admin/spotify', match: (p) => p === '/admin/spotify' },
  ]],
];

function Sidebar({ admin, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col border-r border-ink-line bg-ink px-3 py-4">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4 flex items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-ink-soft"
      >
        <img src={logo} alt="2K Overalls" className="h-8 w-8 object-contain" />
        <span>
          <span className="block font-display text-sm uppercase tracking-wide text-bone">2K Overalls</span>
          <span className="block text-[11px] font-medium uppercase tracking-wider text-brand">Command Center</span>
        </span>
      </button>

      <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
        {NAV_GROUPS.map(([label, items]) => (
          <div key={label}>
            <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-[.14em] text-bone-dim/80">
              {label}
            </div>
            <div className="space-y-1">
              {items.map(({ label: labelText, icon, to, match }) => {
                const active = match(pathname);
                return (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    className={`group flex w-full items-center gap-3 border px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'border-brand/40 bg-brand/10 text-bone'
                        : 'border-transparent text-bone-dim hover:border-ink-line hover:bg-ink-soft hover:text-bone'
                    }`}
                  >
                    <span className={`grid h-7 w-7 flex-shrink-0 place-items-center border ${active ? 'border-brand/40 text-brand' : 'border-ink-line text-bone-dim group-hover:text-bone'}`}>
                      <Icon name={icon} size={14} />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{labelText}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-3 border border-ink-line bg-ink-soft p-2.5">
        {admin && (
          <div className="mb-2 truncate">
            <div className="truncate text-sm font-semibold text-bone">{admin.username}</div>
            <div className="truncate text-xs text-bone-dim">{admin.email}</div>
          </div>
        )}
        <button
          onClick={() => window.open('/', '_blank')}
          className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-bone-dim transition-colors hover:bg-ink hover:text-bone"
        >
          <Icon name="external" size={15} /> View Site
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-down/80 transition-colors hover:bg-down/10 hover:text-down"
        >
          <Icon name="logout" size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}

// Shared shell for every authenticated admin page — fixed dark sidebar +
// content area. AdminLogin is the only admin page that doesn't use this
// (nothing to navigate to before authenticating).
export default function AdminLayout({ admin, onLogout, title, subtitle, actions, children }) {
  return (
    <div className="min-h-screen bg-ink">
      <Sidebar admin={admin} onLogout={onLogout} />
      <main className="ml-[248px] min-h-screen">
        {(title || actions) && (
          <header className="sticky top-0 z-20 border-b border-ink-line bg-ink/95 px-6 py-3 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {title && <h1 className="font-display text-xl uppercase tracking-wide text-bone">{title}</h1>}
                {subtitle && <p className="text-xs text-bone-dim">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </header>
        )}
        <div className="px-6 py-4">{children}</div>
      </main>
    </div>
  );
}
