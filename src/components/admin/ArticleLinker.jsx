import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

// Searchable multi-select of native 2koveralls write-up articles, for "Related Coverage".
export default function ArticleLinker({ selectedIds, onChange }) {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API_URL}/api/koveralls-articles/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setArticles(list);
        // The initial selectedIds may come from a merged related-articles
        // response that includes ids from the old shared articles table —
        // drop anything that isn't actually a native write-up so it never
        // gets submitted as a koveralls_article_id.
        const validIds = new Set(list.map(a => a.id));
        const sanitized = selectedIds.filter(id => validIds.has(id));
        if (sanitized.length !== selectedIds.length) onChange(sanitized);
      })
      .catch(() => setArticles([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter(x => x !== id));
    else onChange([...selectedIds, id]);
  };

  const filtered = articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles to link..."
        className="mb-2 w-full border border-ink-line bg-ink px-3 py-2 text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
      />
      <div className="max-h-48 overflow-y-auto border border-ink-line">
        {filtered.length === 0 ? (
          <p className="p-3 text-sm text-bone-dim">No articles found.</p>
        ) : (
          filtered.map((a) => (
            <label key={a.id} className="flex cursor-pointer items-center gap-2 border-b border-ink-line px-3 py-2 last:border-0 hover:bg-ink">
              <input
                type="checkbox"
                checked={selectedIds.includes(a.id)}
                onChange={() => toggle(a.id)}
                className="accent-brand"
              />
              <span className="text-sm text-bone">{a.title}</span>
            </label>
          ))
        )}
      </div>
      {selectedIds.length > 0 && (
        <p className="mt-1 text-xs text-bone-dim">{selectedIds.length} article(s) linked</p>
      )}
    </div>
  );
}
