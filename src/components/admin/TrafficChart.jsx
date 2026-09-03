// Compact hand-rolled bar chart for monthly visitor sessions — no charting
// library needed for a handful of bars, consistent with RatingHistoryChart.
export default function TrafficChart({ monthly = [] }) {
  const points = monthly.slice(-12);

  if (points.length < 2) {
    return (
      <div className="grid h-[140px] place-items-center border border-ink-line bg-ink text-center text-xs text-bone-dim">
        Not enough monthly data yet.
      </div>
    );
  }

  const width = 760;
  const height = 140;
  const padX = 8;
  const padTop = 16;
  const padBottom = 20;
  const max = Math.max(...points.map(p => p.visitors), 1);
  const barGap = 6;
  const barWidth = (width - padX * 2 - barGap * (points.length - 1)) / points.length;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[480px]" preserveAspectRatio="xMidYMid meet">
        {points.map((p, i) => {
          const barHeight = Math.max((p.visitors / max) * (height - padTop - padBottom), 1);
          const x = padX + i * (barWidth + barGap);
          const y = height - padBottom - barHeight;
          return (
            <g key={p.yearMonth || i}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#f97316" fillOpacity={i === points.length - 1 ? 1 : 0.55} />
              <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="#a8a5a0">
                {p.visitors > 0 ? p.visitors.toLocaleString() : ''}
              </text>
              <text x={x + barWidth / 2} y={height - 5} textAnchor="middle" fontSize="9" fill="#a8a5a0">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
