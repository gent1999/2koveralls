// Editable list of {label, value} attribute rows (e.g. "Lyrics" -> 94).
// Stored as a flexible JSON object rather than fixed columns, so admins
// aren't locked into a specific attribute system.
export default function AttributeEditor({ rows, onChange }) {
  const update = (i, field, val) => {
    const next = rows.slice();
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  const addRow = () => onChange([...rows, { label: '', value: '' }]);
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={row.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Attribute (e.g. Lyrics)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            min="0"
            max="99"
            value={row.value}
            onChange={(e) => update(i, 'value', e.target.value)}
            placeholder="0-99"
            className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-500 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        + Add attribute
      </button>
    </div>
  );
}

export const DEFAULT_ATTRIBUTE_ROWS = [
  { label: 'Lyrics', value: '' },
  { label: 'Flow', value: '' },
  { label: 'Impact', value: '' },
  { label: 'Consistency', value: '' },
  { label: 'Popularity', value: '' },
];
