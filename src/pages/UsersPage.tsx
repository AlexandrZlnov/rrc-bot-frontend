import { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getEmployees, type Employee } from '../services/users.service';

export default function UsersPage() {
  const [rows, setRows] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setRows(await getEmployees()); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Users</h2>
      {loading ? <div>Loading...</div> : (
        <Table columns={[
          { key: 'id', label: 'ID' },
          { key: 'tg_name', label: 'TG Name' },
          { key: 'tg_id', label: 'TG ID' },
          { key: 'is_blocked', label: 'Blocked' },
        ] as any} rows={rows} />
      )}
    </div>
  );
}
