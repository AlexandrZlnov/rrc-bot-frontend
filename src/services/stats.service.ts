import { api } from '../lib/api';
import type { SearchQueryStat } from '../types/stats';

export async function getTopQueries(): Promise<SearchQueryStat[]> {
  const { data } = await api.get<SearchQueryStat[]>('/admin/search-stats/top');
  return data;
}

export async function getWorstQueries(): Promise<SearchQueryStat[]> {
  const { data } = await api.get<SearchQueryStat[]>('/admin/search-stats/worst');
  return data;
}
