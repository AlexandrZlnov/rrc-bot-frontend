import { useEffect, useState } from 'react';
import { getAllBlocks, updateBlock } from '../services/blocks.service';
import type { Block, BlockUpdate } from '../types/blocks';
import { api } from '../lib/api';

type BlockWithContent = Block & { content: string };

export default function MenuBlocksPage() {
  const [blocks, setBlocks] = useState<BlockWithContent[]>([]);
  const [editingBlock, setEditingBlock] = useState<BlockWithContent | null>(null);

  // Загрузка блоков
  const loadBlocks = async () => {
    try {
      const data = await getAllBlocks();
      const normalizedData = data.map(b => ({
        ...b,
        content: b.text_content || '',
        parent_id: b.parent_id || null,
        description: b.description || '',
        link: b.link || '',
        is_searchable: b.is_searchable || false,
        created_at: b.created_at || '',
      }));
      setBlocks(normalizedData);
    } catch (err) {
      console.error('Ошибка загрузки блоков:', err);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  // Рекурсивное построение дерева
  const buildTree = (
    items: BlockWithContent[],
    parentId: string | null = null,
    level: number = 0
  ): { block: BlockWithContent; level: number }[] =>
    items
      .filter(b => b.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .flatMap(b => [{ block: b, level }, ...buildTree(items, b.id, level + 1)]);

  const rows = buildTree(blocks);

  // Редактирование
  const handleEdit = (block: BlockWithContent) => setEditingBlock(block);

  const handleModalChange = (field: keyof BlockWithContent, value: string | boolean) => {
    if (!editingBlock) return;
    setEditingBlock({ ...editingBlock, [field]: value });
  };

  const handleModalSave = async () => {
    if (!editingBlock) return;
    try {
      const payload: BlockUpdate = {
        title: editingBlock.title,
        description: editingBlock.description,
        text_content: editingBlock.content,
        link: editingBlock.link,
        is_searchable: editingBlock.is_searchable,
      };
      await updateBlock(editingBlock.id, payload);
      setEditingBlock(null);
      await loadBlocks();
    } catch (err) {
      console.error('Ошибка сохранения блока:', err);
    }
  };

  // Удаление
  const handleDelete = async (block: BlockWithContent) => {
    if (!window.confirm(`Удалить блок "${block.title}"?`)) return;
    try {
      await api.delete('/admin/blocks', { params: { id: block.id } });
      setBlocks(prev => prev.filter(b => b.id !== block.id));
    } catch (err) {
      console.error('Ошибка удаления блока:', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Блоки меню (структура)</h2>
        <button
          style={{
            background: '#E1081A',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + New Block
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Title</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Description</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Content</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Link</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Searchable</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Created At</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ block, level }) => {
            const isParent = !block.parent_id;
            return (
              <tr
                key={block.id}
                style={{
                  background: isParent ? '#C3C3C3' : '#DDDDDD',
                  fontWeight: isParent ? 'bold' : 'normal',
                }}
              >
                <td style={{ padding: '8px' }}>
                  <span style={{ marginLeft: `${level * 1.5}rem` }}>{block.title}</span>
                </td>
                <td style={{ padding: '8px' }}>{block.description}</td>
                <td style={{ padding: '8px', whiteSpace: 'pre-wrap', maxHeight: '3em', overflow: 'hidden' }}>
                  {block.content.length > 100 ? block.content.substring(0, 100) + '...' : block.content}
                </td>
                <td style={{ padding: '8px' }}>{block.link || '-'}</td>
                <td style={{ padding: '8px' }}>{block.is_searchable ? '✔' : '✖'}</td>
                <td style={{ padding: '8px' }}>{block.created_at ? new Date(block.created_at).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '8px' }}>
                  <button style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(block)}>✏️</button>
                  <button onClick={() => handleDelete(block)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Модальное окно редактирования */}
      {editingBlock && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', width: '400px' }}>
            <h3>Редактировать блок</h3>
            <label>
              Title:
              <input
                type="text"
                value={editingBlock.title}
                onChange={(e) => handleModalChange('title', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
            </label>
            <label>
              Description:
              <textarea
                value={editingBlock.description || ''}
                onChange={(e) => handleModalChange('description', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
            </label>
            <label>
              Content:
              <textarea
                value={editingBlock.content}
                onChange={(e) => handleModalChange('content', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
            </label>
            <label>
              Link:
              <input
                type="text"
                value={editingBlock.link || ''}
                onChange={(e) => handleModalChange('link', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
            </label>
            <label>
              Searchable:
              <input
                type="checkbox"
                checked={editingBlock.is_searchable || false}
                onChange={(e) => handleModalChange('is_searchable', e.target.checked)}
              />
            </label>
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button onClick={() => setEditingBlock(null)} style={{ marginRight: '0.5rem' }}>Отмена</button>
              <button onClick={handleModalSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
