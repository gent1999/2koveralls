const LABELS = {
  mainstream: 'Mainstream',
  rising: 'Rising',
  underground: 'Underground',
  legend: 'Legend',
};

export default function TierBadge({ tier, className = '' }) {
  if (!tier || !LABELS[tier]) return null;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider text-bone-dim ${className}`}>
      {LABELS[tier]}
    </span>
  );
}

export { LABELS as TIER_LABELS };
