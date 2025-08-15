import { api } from '../lib/api';

export type Employee = { id: number; tg_name: string; tg_id: number; created_at?: string; is_blocked?: boolean };

// Adjust the endpoint to match your backend router if different.
export async function getEmployees(): Promise<Employee[]> {
  const { data } = await api.get<Employee[]>('/admin/employees');
  return data;
}
