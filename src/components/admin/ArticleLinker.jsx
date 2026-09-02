import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

// Searchable multi-select of existing lowkeygrid articles, for "Related Coverage".
export default function ArticleLinker({ selectedIds, onChange }) {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API_URL}/api/lowkeygrid/articles/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]));
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
        className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="max-h-48 overflow-y-auto rounded-md border border-gray-300">
        {filtered.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">No articles found.</p>
        ) : (
          filtered.map((a) => (
            <label key={a.id} className="flex cursor-pointer items-center gap-2 border-b border-gray-100 px-3 py-2 last:border-0 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedIds.includes(a.id)}
                onChange={() => toggle(a.id)}
              />
              <span className="text-sm text-gray-800">{a.title}</span>
            </label>
          ))
        )}
      </div>
      {selectedIds.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">{selectedIds.length} article(s) linked</p>
      )}
    </div>
  );
}
