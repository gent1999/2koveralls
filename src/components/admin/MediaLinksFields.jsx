const inputClass = 'w-full border border-ink-line bg-ink px-3 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none';
const labelClass = 'mb-2 block text-xs font-medium uppercase tracking-wide text-bone-dim';

// Spotify / YouTube / SoundCloud link inputs, shared by the Trends and
// Articles admin forms. The article detail page (NewsDetail.jsx) already
// renders an embed for whichever of these are set, so no extra wiring is
// needed beyond capturing the URLs here.
export default function MediaLinksFields({ spotifyUrl, onSpotifyUrlChange, youtubeUrl, onYoutubeUrlChange, soundcloudUrl, onSoundcloudUrlChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label htmlFor="spotifyUrl" className={labelClass}>Spotify Link</label>
        <input
          type="url"
          id="spotifyUrl"
          value={spotifyUrl}
          onChange={(e) => onSpotifyUrlChange(e.target.value)}
          className={inputClass}
          placeholder="https://open.spotify.com/..."
        />
      </div>
      <div>
        <label htmlFor="youtubeUrl" className={labelClass}>YouTube Link</label>
        <input
          type="url"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={(e) => onYoutubeUrlChange(e.target.value)}
          className={inputClass}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label htmlFor="soundcloudUrl" className={labelClass}>SoundCloud Link</label>
        <input
          type="url"
          id="soundcloudUrl"
          value={soundcloudUrl}
          onChange={(e) => onSoundcloudUrlChange(e.target.value)}
          className={inputClass}
          placeholder="https://soundcloud.com/..."
        />
      </div>
    </div>
  );
}
