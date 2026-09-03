const ICONS = {
  dashboard: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z',
  add: 'M12 5v14M5 12h14',
  list: 'M5 6h14M5 12h14M5 18h9',
  overall: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674Z',
  spotify: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
  users: 'M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 19v-1a3 3 0 0 0-2-2.83',
  chart: 'M4 17l6-6 4 4 6-8',
  search: 'M11 19a8 8 0 1 1 5.7-2.3L21 21',
  external: 'M14 4h6v6M20 4l-9 9M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4',
  logout: 'M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4M15 16l4-4-4-4M19 12H9',
  pulse: 'M4 12h4l2-7 4 14 2-7h4',
  article: 'M6 4h9l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M14 4v5h5 M9 12h6 M9 16h6',
};

export function Icon({ name, size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Panel({ title, subtitle, icon, right, children, className = '' }) {
  return (
    <section className={`border border-ink-line bg-ink-soft ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-4 border-b border-ink-line px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center border border-ink-line bg-ink text-bone-dim">
                <Icon name={icon} size={14} />
              </span>
            )}
            <div>
              {title && <h2 className="font-display text-sm uppercase tracking-wide text-bone">{title}</h2>}
              {subtitle && <p className="text-xs text-bone-dim">{subtitle}</p>}
            </div>
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

const TONES = {
  slate: 'text-bone bg-ink',
  up: 'text-up bg-ink',
  brand: 'text-brand bg-ink',
};

export function MetricCard({ label, value, meta, tone = 'slate', trend }) {
  return (
    <div className="border border-ink-line bg-ink-soft p-3 transition-colors hover:border-brand/60">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="text-[11px] font-medium uppercase tracking-wide text-bone-dim">{label}</div>
        {trend != null && trend !== 0 && (
          <span className={`text-xs font-semibold ${trend > 0 ? 'text-up' : 'text-down'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className={`inline-flex px-1.5 py-0.5 text-xl font-semibold tracking-tight ${TONES[tone] || TONES.slate}`}>
        {value}
      </div>
      {meta && <div className="mt-1 text-xs text-bone-dim">{meta}</div>}
    </div>
  );
}

const PILL_TONES = {
  slate: 'bg-ink text-bone-dim ring-ink-line',
  brand: 'bg-brand/10 text-brand ring-brand/30',
  up: 'bg-up/10 text-up ring-up/30',
  down: 'bg-down/10 text-down ring-down/30',
};

export function Pill({ children, tone = 'slate', pulse = false }) {
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium ring-1 ${PILL_TONES[tone] || PILL_TONES.slate}`}>
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

// Inline stat, more compact than MetricCard — for rows of small numbers
// where a full bordered card would take up too much vertical space.
export function StatChip({ label, value, trend, tone = 'slate' }) {
  return (
    <div className="flex items-center gap-2 border border-ink-line bg-ink px-2.5 py-1.5">
      <span className="text-[10px] uppercase tracking-wide text-bone-dim">{label}</span>
      <span className={`text-sm font-semibold ${tone === 'brand' ? 'text-brand' : 'text-bone'}`}>{value}</span>
      {trend != null && trend !== 0 && (
        <span className={`text-[10px] font-semibold ${trend > 0 ? 'text-up' : 'text-down'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  );
}
