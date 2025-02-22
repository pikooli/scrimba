'use server';
import { Document } from '@/type';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);

export const insertDocument = async (documents: Document[]) => {
  'use server';
  return await supabase.from('documents').insert(documents);
};
