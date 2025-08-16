export type Block = {
  id: string;
  parent_id?: string | null;
  title: string;
  description?: string | null;
  text_content?: string | null;
  link?: string | null;
  prev_id?: string | null;
  next_id?: string | null;
  created_at?: string;
  updated_at?: string;
  is_searchable?: boolean; // from separate endpoint
};

export type BlockCreate = Omit<Block, 'id' | 'created_at' | 'updated_at'>;
export type BlockUpdate = Partial<BlockCreate>;
