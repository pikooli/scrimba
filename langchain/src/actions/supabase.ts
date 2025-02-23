'use server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);

export const insertDocument = async (documents: Pick<Database['public']['Tables']['langchaindocuments']['Row'], 'content' | 'embedding'>[]) => {
  'use server';
  return await supabase.from('langchaindocuments').insert(documents);
};

export const searchDocument = async (query: number[]) => {
  'use server';
  return await supabase.rpc('match_langchain_documents', {
    query_embedding: query,
    match_threshold: 0.5,
    match_count: 1
  })
};
