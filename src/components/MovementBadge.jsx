// Shows rating movement (▲/▼) — renders nothing if there's no history to compare against.
// "isNew" shows a NEW badge instead, for overalls without enough history yet.
export default function MovementBadge({ change, isNew = false, className = '' }) {
  if (isNew) {
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider text-brand ${className}`}>
        New
      </span>
    );
  }

  if (change === null || change === undefined || change === 0) return null;

  const up = change > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${up ? 'text-up' : 'text-down'} ${className}`}>
      {up ? '▲' : '▼'} {Math.abs(change)}
    </span>
  );
}
