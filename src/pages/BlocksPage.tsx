import { useEffect, useMemo, useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import BlockForm from '../components/forms/BlockForm';
import { createBlock, getAllBlocks, setSearchVisibility, updateBlock } from '../services/blocks.service';
import type { Block } from '../types/blocks';

export default function BlocksPage() {
  const [rows, setRows] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Block | null>(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await getAllBlocks()); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'link', label: 'Link' },
    { key: 'id', label: 'Actions', render: (r: Block) => (
      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm border rounded-lg" onClick={() => { setEdit(r); setOpen(true); }}>Edit</button>
        <button className="px-3 py-1 text-sm border rounded-lg" onClick={async ()=>{ await setSearchVisibility(r.id, !(r as any).is_searchable); await load(); }}>Toggle Search</button>
      </div>
    )}
  ], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Menu Blocks</h2>
        <button className="px-4 py-2 rounded-lg bg-black text-white" onClick={()=>{ setEdit(null); setOpen(true); }}>New Block</button>
      </div>
      {loading ? <div>Loading...</div> : <Table columns={columns as any} rows={rows} />}

      <Modal open={open} onClose={()=>setOpen(false)} title={edit? 'Edit Block' : 'New Block'}>
        <BlockForm initial={edit ?? undefined} onSubmit={async (payload)=>{
          if (edit) await updateBlock(edit.id, payload);
          else await createBlock(payload);
          setOpen(false); await load();
        }} />
      </Modal>
    </div>
  );
}
