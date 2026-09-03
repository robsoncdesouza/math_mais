import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const URL = "https://xmtmxvqzientpbfommgh.supabase.co";
const KEY = "sb_publishable_KwGCQi3sIMNubRyglZciTw_3lHFM3X9";

export const supabase = createClient(URL, KEY);