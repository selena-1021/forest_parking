import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gkvrdeonqmetydaplxox.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdnJkZW9ucW1ldHlkYXBseG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzYxOTgsImV4cCI6MjA5MzQ1MjE5OH0.bRkm0KgdmIPdx13ZeZVmISa2conpCKsju5WWqWaRu4w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ROW_ID = 'main';
const PERSIST_KEYS = ['pw', 'title', 'admins', 'asgn', 'res', 'visits'];

// Supabase에서 상태 불러오기
export async function loadFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('villa_state')
      .select('data')
      .eq('id', ROW_ID)
      .single();
    if (error || !data?.data || Object.keys(data.data).length === 0) return null;
    return data.data;
  } catch { return null; }
}

// Supabase에 상태 저장 (디바운스용 — 연속 변경 시 마지막만 저장)
export async function saveToSupabase(state) {
  try {
    const toSave = Object.fromEntries(PERSIST_KEYS.map(k => [k, state[k]]));
    await supabase
      .from('villa_state')
      .upsert({ id: ROW_ID, data: toSave });
  } catch (e) {
    console.error('Supabase 저장 실패:', e);
  }
}
