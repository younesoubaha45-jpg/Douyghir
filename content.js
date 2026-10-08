const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) return res.status(500).json({ error: error.message });
    const result = {};
    (data || []).forEach(r => { result[r.key] = r.value; });
    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`)
      return res.status(401).json({ error: 'Unauthorized' });
    const body = req.body || {};
    const updates = Object.entries(body).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
};
