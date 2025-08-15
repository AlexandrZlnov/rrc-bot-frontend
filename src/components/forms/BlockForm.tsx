import { useState } from 'react';
import type { Block, BlockCreate } from '../../types/blocks';

export default function BlockForm({ initial, onSubmit }: { initial?: Partial<Block>; onSubmit: (payload: BlockCreate) => Promise<void> }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [link, setLink] = useState(initial?.link || '');
  const [parentId, setParentId] = useState(initial?.parent_id || '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, description, link, parent_id: parentId || null } as BlockCreate);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input className="w-full border rounded-lg px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea className="w-full border rounded-lg px-3 py-2" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Link</label>
        <input className="w-full border rounded-lg px-3 py-2" value={link} onChange={e=>setLink(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Parent ID (optional)</label>
        <input className="w-full border rounded-lg px-3 py-2" value={parentId || ''} onChange={e=>setParentId(e.target.value)} />
      </div>
      <button className="px-4 py-2 rounded-lg bg-black text-white">Save</button>
    </form>
  );
}
