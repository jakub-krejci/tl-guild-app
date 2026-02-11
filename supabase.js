import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = 'https://eorirajluoadqhtjvboz.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Y51Oa_SqZagdJhEgP6KQCg_4ux8L4Yt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
