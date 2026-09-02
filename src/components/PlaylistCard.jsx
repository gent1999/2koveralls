export default function PlaylistCard({ playlist }) {
  return (
    <a
      href={playlist.spotify_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden border border-ink-line bg-ink-soft transition-colors hover:border-brand"
    >
      {playlist.cover_image_url ? (
        <img
          src={playlist.cover_image_url}
          alt={playlist.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-ink-raised">
          <svg className="h-10 w-10 text-ink-line" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z"/>
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone drop-shadow-md">
          {playlist.title}
        </h3>
        {playlist.description && (
          <p className="mt-1 text-xs text-bone-dim line-clamp-2">{playlist.description}</p>
        )}
      </div>
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-ink opacity-0 transition-opacity group-hover:opacity-100">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </a>
  );
}
