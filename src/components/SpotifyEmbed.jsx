import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Spotify Embed Component
 * Displays Spotify playlist/album/track embeds in sidebar
 * Fetches embeds from spotify_embeds table filtered by page type and site
 * @param {string} pageType - 'home' or 'article' to determine which embeds to show
 */
const SpotifyEmbed = ({ pageType = 'home' }) => {
  const [embeds, setEmbeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmbeds = async () => {
      try {
        const response = await fetch(`${API_URL}/api/spotify-embeds?page_type=${pageType}&site=lowkeygrid`);
        const data = await response.json();
        setEmbeds(data.embeds || []);
      } catch (error) {
        console.error('Error fetching Spotify embeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbeds();
  }, [pageType]);

  if (loading) {
    return <div className="h-full w-full animate-pulse bg-ink-raised" />;
  }

  // Don't show if no embeds exist for this page type
  if (embeds.length === 0) {
    return null;
  }

  return (
    <>
      {embeds.map((embed) => {
        // Add theme and utm parameters for compact view
        const embedUrl = new URL(embed.spotify_url);
        embedUrl.searchParams.set('utm_source', 'generator');
        embedUrl.searchParams.set('theme', '0');

        return (
          <iframe
            key={embed.id}
            style={{ borderRadius: '0px', height: '100%', width: '100%' }}
            src={embedUrl.toString()}
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={embed.title}
          ></iframe>
        );
      })}
    </>
  );
};

export default SpotifyEmbed;
