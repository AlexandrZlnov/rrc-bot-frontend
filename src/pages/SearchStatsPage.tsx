import { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getTopQueries, getWorstQueries } from '../services/stats.service';
import type { SearchQueryStat } from '../types/stats';

export default function SearchStatsPage() {
  const [top, setTop] = useState<SearchQueryStat[]>([]);
  const [worst, setWorst] = useState<SearchQueryStat[]>([]);

  useEffect(() => {
    (async () => {
      setTop(await getTopQueries());
      setWorst(await getWorstQueries());
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Search Stats</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Top queries</h3>
        <Table columns={[{ key: 'query', label: 'Query' }, { key: 'count', label: 'Count' }] as any} rows={top} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Worst queries</h3>
        <Table columns={[{ key: 'query', label: 'Query' }, { key: 'count', label: 'Count' }] as any} rows={worst} />
      </div>
    </div>
  );
}
