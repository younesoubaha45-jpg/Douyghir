const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`)
    return res.status(401).json({ error: 'Unauthorized' });

  const { base64, filename, mimetype } = req.body || {};
  if (!base64 || !filename) return res.status(400).json({ error: 'Missing data' });

  const buffer = Buffer.from(base64, 'base64');
  const path = `${Date.now()}-${filename}`;
  const { error } = await supabase.storage.from('douyghir-media').upload(path, buffer, { contentType: mimetype || 'image/jpeg', upsert: true });
  if (error) return res.status(500).json({ error: error.message });

  const { data } = supabase.storage.from('douyghir-media').getPublicUrl(path);
  return res.status(200).json({ url: data.publicUrl });
};
