
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmltauxzngwgahvpmadf.supabase.co';
const supabaseKey = 'sb_publishable_TGtU6SlQceLrUnSS0HXYvA_LW97-6DA';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper for upserting data
export const cloudSync = {
  async saveTeacher(data: any) {
    const { error } = await supabase.from('teacher_profile').upsert({ id: 'main', ...data });
    return { error };
  },
  async saveStudents(data: any[]) {
    const { error } = await supabase.from('students').upsert(data);
    return { error };
  },
  async saveLinks(data: any[]) {
    const { error } = await supabase.from('links').upsert(data);
    return { error };
  },
  async saveSections(data: any[]) {
    const { error } = await supabase.from('sections').upsert(data);
    return { error };
  }
};
