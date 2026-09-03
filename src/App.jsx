import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { initGA } from './utils/analytics';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import SubmitMusic from './pages/SubmitMusic';
import DMCA from './pages/DMCA';
import Terms from './pages/Terms';
import ArticleDetail from './pages/ArticleDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Overalls from './pages/Overalls';
import OverallDetail from './pages/OverallDetail';
import Rankings from './pages/Rankings';
import Playlists from './pages/Playlists';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import OverallsList from './pages/admin/OverallsList';
import OverallCreate from './pages/admin/OverallCreate';
import OverallEdit from './pages/admin/OverallEdit';
import ArticlesList from './pages/admin/ArticlesList';
import ArticleCreate from './pages/admin/ArticleCreate';
import ArticleEdit from './pages/admin/ArticleEdit';
import WriteupsList from './pages/admin/WriteupsList';
import WriteupCreate from './pages/admin/WriteupCreate';
import WriteupEdit from './pages/admin/WriteupEdit';
import SpotifyManager from './pages/admin/SpotifyManager';

// The admin "command center" owns its own dark sidebar shell — the public
// marketing nav (sticky, z-50) would stack on top of it and doesn't belong
// on an authenticated tool anyway.
function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-ink">
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/submit-music" element={<SubmitMusic />} />
        <Route path="/dmca" element={<DMCA />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/overalls" element={<Overalls />} />
        <Route path="/overalls/:slug" element={<OverallDetail />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/playlists" element={<Playlists />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/overalls" element={<OverallsList />} />
        <Route path="/admin/overalls/create" element={<OverallCreate />} />
        <Route path="/admin/overalls/edit/:id" element={<OverallEdit />} />
        <Route path="/admin/articles" element={<ArticlesList />} />
        <Route path="/admin/articles/create" element={<ArticleCreate />} />
        <Route path="/admin/articles/edit/:id" element={<ArticleEdit />} />
        <Route path="/admin/writeups" element={<WriteupsList />} />
        <Route path="/admin/writeups/create" element={<WriteupCreate />} />
        <Route path="/admin/writeups/edit/:id" element={<WriteupEdit />} />
        <Route path="/admin/spotify" element={<SpotifyManager />} />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    try {
      initGA();
    } catch (error) {
      console.error('Failed to initialize GA:', error);
      // Continue loading app even if analytics fails
    }
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AppShell />
      </Router>
    </HelmetProvider>
  );
}

export default App;
