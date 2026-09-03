import { Link } from 'react-router-dom';
import logo from '../assets/logo_2k.png';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/submit-music', label: 'Submit Music' },
  { to: '/dmca', label: 'DMCA' },
  { to: '/terms', label: 'Terms of Use' },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand bg-ink">
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
