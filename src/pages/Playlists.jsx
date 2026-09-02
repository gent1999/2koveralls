import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import PlaylistCard from '../components/PlaylistCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/spotify-embeds?site=lowkeygrid&page_type=playlist`)
      .then(r => r.json())
      .then(data => setPlaylists(data?.embeds || []))
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>Playlists | 2koveralls</title>
        <meta name="description" content="AUX — what 2K Overalls is playing right now." />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl uppercase text-bone sm:text-5xl">AUX</h1>
        <p className="mt-2 text-sm text-bone-dim">What we're playing right now.</p>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand" />
            </div>
          ) : playlists.length === 0 ? (
            <p className="border border-ink-line bg-ink-soft p-10 text-center text-sm text-bone-dim">
              No playlists yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {playlists.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
