import { api } from '../lib/api';
import type { Block, BlockCreate, BlockUpdate } from '../types/blocks';

const apiUrl = (import.meta as any).env.VITE_API_URL;

export async function getAllBlocks(): Promise<Block[]> {
  const { data } = await api.get<Block[]>('/admin/blocks');
  return data;
}

export async function getBlock(id: string): Promise<Block> {
  const { data } = await api.get<Block>('/admin/blocks', { params: { id } });
  return data;
}

export async function createBlock(payload: BlockCreate): Promise<Block> {
  const { data } = await api.post<Block>('/admin/blocks', payload);
  return data;
}

export async function updateBlock(id: string, payload: BlockUpdate): Promise<Block> {
  const { data } = await api.patch<Block>('/admin/blocks', payload, { params: { id } });
  return data;
}

export async function setSearchVisibility(id: string, isSearchable: boolean): Promise<void> {
  await api.patch('/admin/blocks/search-visibility', { is_searchable: isSearchable }, { params: { id } });
}

// пример; подправь путь/метод под свой бэкенд
export async function reorderBlocks(idsInOrder: string[]): Promise<void> {
  try {
    await fetch(`${apiUrl}/blocks/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
      body: JSON.stringify({ ids: idsInOrder }),
    });
  } catch (e) {
    // не критично
    console.warn('reorderBlocks failed', e);
  }
}
