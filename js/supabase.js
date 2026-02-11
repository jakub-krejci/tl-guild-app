import { createClient } from "@supabase/supabase-js";

// ❗ Frontend = pouze Anon key / Publishable key
export const supabase = createClient(
  "https://eorirajluoadqhtjvboz.supabase.co", // Supabase URL
  "sb_publishable_Y51Oa_SqZagdJhEgP6KQCg_4ux8L4Yt"       // Anon / Publishable key
);
