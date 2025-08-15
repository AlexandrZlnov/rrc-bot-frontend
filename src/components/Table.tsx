export default function Table<T extends { id?: string | number }>({ columns, rows }: { columns: { key: keyof T; label: string; render?: (row: T) => React.ReactNode }[]; rows: T[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            {columns.map(c => (
              <th key={String(c.key)} className="px-4 py-2 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={String(r.id ?? idx)} className="border-t">
              {columns.map(c => (
                <td key={String(c.key)} className="px-4 py-2">{c.render ? c.render(r) : String(r[c.key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
