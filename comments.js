const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('comments').select('*').order('ts', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, msg } = req.body || {};
    if (!name || !msg) return res.status(400).json({ error: 'Missing fields' });
    const date = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase.from('comments').insert({ name, msg, date, ts: Date.now() }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === 'DELETE') {
    if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`)
      return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.query;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
};
