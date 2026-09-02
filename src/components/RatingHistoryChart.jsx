// Minimal inline SVG line chart — no charting library needed for a handful of points.
export default function RatingHistoryChart({ timeline }) {
  if (!timeline || timeline.length < 2) return null;

  const width = 600;
  const height = 180;
  const padX = 30;
  const padY = 20;

  const ratings = timeline.map(t => t.rating);
  const min = Math.min(...ratings) - 2;
  const max = Math.max(...ratings) + 2;
  const range = max - min || 1;

  const points = timeline.map((t, i) => {
    const x = padX + (i / (timeline.length - 1)) * (width - padX * 2);
    const y = height - padY - ((t.rating - min) / range) * (height - padY * 2);
    return { x, y, rating: t.rating, year: new Date(t.recorded_at).getFullYear() };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
        <path d={path} fill="none" stroke="#f97316" strokeWidth="2" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#f97316" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="12" fill="#f4f2ee" fontWeight="700">
              {p.rating}
            </text>
            <text x={p.x} y={height - 2} textAnchor="middle" fontSize="10" fill="#a8a5a0">
              {p.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
