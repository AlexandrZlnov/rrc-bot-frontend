import React, { useEffect, useMemo, useState } from 'react';
import { getAllBlocks, updateBlock, reorderBlocks } from '../services/blocks.service';
import type { Block } from '../types/blocks';
import {
  Search,
  Filter,
  Edit,
  Check,
  X,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

type BlockWithContent = Block & {
  content: string;
  order_index?: number | null;
  tags?: string[];
};

type SortKey = 'title' | 'created_at' | 'is_searchable';

export default function MenuBlocksPage() {
  const [blocks, setBlocks] = useState<BlockWithContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<BlockWithContent>>({});
  const [search, setSearch] = useState('');
  const [parentFilter, setParentFilter] = useState<string | 'all'>('all');
  const [onlySearchable, setOnlySearchable] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [dragId, setDragId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const data = await getAllBlocks();
      const normalized: BlockWithContent[] = data.map((b: any, i: number) => ({
        ...b,
        content: b.content || '',
        description: b.description ?? '',
        link: b.link || '',
        parent_id: b.parent_id || null,
        is_searchable: !!b.is_searchable,
        created_at: b.created_at || '',
        order_index: b.order_index ?? i,
        tags: b.tags || [],
      }));
      setBlocks(normalized);
    } catch (err) {
      console.error('Ошибка загрузки блоков:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlocks(); }, []);

  const startEdit = (row: BlockWithContent) => {
    setEditingId(row.id);
    setDraft({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      link: row.link,
      is_searchable: row.is_searchable,
      tags: row.tags || [],
    });
  };

  const cancelEdit = () => { setEditingId(null); setDraft({}); };
  const applyDraftChange = (field: keyof BlockWithContent, value: any) => setDraft(prev => ({ ...prev, [field]: value }));

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setDraft(prev => ({ ...prev, tags: tagsArray }));
  };

  const getTagsDisplayValue = () => {
    return draft.tags?.join(', ') || '';
  };

  const saveRow = async () => {
    if (!editingId) return;
    try {
      const payload = {
        title: draft.title ?? '',
        description: draft.description ?? '',
        content: draft.content ?? '',
        link: draft.link ?? '',
        tags: draft.tags || [],
        is_searchable: !!draft.is_searchable,
      };
      await updateBlock(editingId, payload);
      setEditingId(null);
      setDraft({});
      await loadBlocks();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const parents = useMemo(() => Array.from(
    new Map(blocks.filter(b => !b.parent_id).map(b => [b.id, { id: b.id, title: b.title }])).values()
  ), [blocks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = blocks;
    if (q) {
      arr = arr.filter(b => 
        b.title.toLowerCase().includes(q) || 
        (b.description ?? '').toLowerCase().includes(q) || 
        (b.content ?? '').toLowerCase().includes(q) ||
        (b.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }
    if (onlySearchable) arr = arr.filter(b => b.is_searchable);
    if (parentFilter !== 'all') arr = arr.filter(b => (b.parent_id ?? 'root') === parentFilter || b.id === parentFilter);
    arr = [...arr].sort((a, b) => {
      let av: any, bv: any;
      switch (sortKey) {
        case 'title': av = a.title?.toLowerCase() ?? ''; bv = b.title?.toLowerCase() ?? ''; break;
        case 'is_searchable': av = a.is_searchable ? 1 : 0; bv = b.is_searchable ? 1 : 0; break;
        case 'created_at':
        default: av = a.created_at ? new Date(a.created_at).getTime() : 0; bv = b.created_at ? new Date(b.created_at).getTime() : 0;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
    return arr;
  }, [blocks, search, onlySearchable, parentFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [search, onlySearchable, parentFilter]);

  const onDragStart = (id: string) => setDragId(id);
  const onDragOver = (e: React.DragEvent<HTMLTableRowElement>) => e.preventDefault();
  const onDrop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const sourceIdx = blocks.findIndex(b => b.id === dragId);
    const targetIdx = blocks.findIndex(b => b.id === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;
    const next = [...blocks];
    const [moved] = next.splice(sourceIdx, 1);
    next.splice(targetIdx, 0, moved);
    const withOrder = next.map((b, i) => ({ ...b, order_index: i }));
    setBlocks(withOrder);
    setDragId(null);
    try { if (typeof reorderBlocks === 'function') await reorderBlocks(withOrder.map(b => b.id)); } catch { console.warn('Не удалось сохранить порядок'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Blocks</h1>
        <p className="text-sm text-gray-600 mt-1">
          Управление блоками меню Ver0.3: поиск, фильтры, drag-and-drop порядок, inline-редактирование.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию, описанию, контенту или тегам..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={parentFilter}
                onChange={e => setParentFilter(e.target.value as any)}
              >
                <option value="all">Все разделы</option>
                <option value="root">Только корневые</option>
                {parents.map(p => (
                  <option key={p.id} value={p.id}>Раздел: {p.title}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlySearchable}
                onChange={e => setOnlySearchable(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Только searchable</span>
            </label>

            <div className="flex items-center gap-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
              >
                <option value="created_at">По дате</option>
                <option value="title">По названию</option>
                <option value="is_searchable">По searchable</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Сменить направление сортировки"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <GripVertical className="h-4 w-4 mx-auto" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Searchable
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {current.map((row) => {
                const isEditing = editingId === row.id;
                const indent = row.parent_id ? 'pl-8' : '';

                return (
                  <tr
                    key={row.id}
                    draggable
                    onDragStart={() => onDragStart(row.id)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(row.id)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex justify-center cursor-move">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                    </td>
                    
                    <td className={`px-4 py-4 ${indent}`}>
                      {isEditing ? (
                        <input
                          value={String(draft.title ?? '')}
                          onChange={e => applyDraftChange('title', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{row.title}</div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <input
                          value={String(draft.description ?? '')}
                          onChange={e => applyDraftChange('description', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600">{row.description || '-'}</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <textarea
                          value={String(draft.content ?? '')}
                          onChange={e => applyDraftChange('content', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                          rows={3}
                        />
                      ) : (
                        <span className="text-gray-600">
                          {(row.content ?? '').slice(0, 100)}
                          {(row.content ?? '').length > 100 && '...'}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <input
                          value={getTagsDisplayValue()}
                          onChange={handleTagsChange}
                          placeholder="tag1, tag2, tag3"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(row.tags || []).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                          {(row.tags || []).length === 0 && (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      {isEditing ? (
                        <label className="flex items-center justify-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!draft.is_searchable}
                            onChange={e => applyDraftChange('is_searchable', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Searchable</span>
                        </label>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.is_searchable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {row.is_searchable ? 'Да' : 'Нет'}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={saveRow}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                          >
                            <Check className="h-4 w-4" />
                            Сохранить
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                          >
                            <X className="h-4 w-4" />
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(row)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#DE443A] text-white rounded-md hover:bg-[#C53A30] focus:ring-2 focus:ring-[#DE443A] focus:ring-offset-2 transition-colors text-sm font-medium"
                        >
                          <Edit className="h-4 w-4" />
                          Редактировать
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Показано {current.length} из {filtered.length} записей
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </button>
          
          <span className="text-sm text-gray-700">
            Страница {page} из {totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Вперед
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}