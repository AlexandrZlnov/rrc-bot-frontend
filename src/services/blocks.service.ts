import { api } from '../lib/api';
import type { Block, BlockCreate, BlockUpdate } from '../types/blocks';

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
