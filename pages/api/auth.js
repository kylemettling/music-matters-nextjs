import { supabase } from "./supabase";

export default async function handler(req, res) {
  await supabase.auth.api.setAuthCookie(req, res);
}
