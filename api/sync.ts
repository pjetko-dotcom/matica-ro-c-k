import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Kód je povinný' });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      await kv.set(`matica-${code}`, JSON.stringify(data), { ex: 7 * 24 * 60 * 60 }); // 7 days
      return res.status(200).json({ success: true, message: 'Dáta uložené' });
    } catch (error) {
      console.error('Save error:', error);
      return res.status(500).json({ error: 'Chyba pri ukladaní' });
    }
  }

  if (req.method === 'GET') {
    try {
      const data = await kv.get(`matica-${code}`);
      if (!data) {
        return res.status(404).json({ error: 'Nič sa nenašlo' });
      }
      return res.status(200).json(JSON.parse(data));
    } catch (error) {
      console.error('Load error:', error);
      return res.status(500).json({ error: 'Chyba pri sťahovaní' });
    }
  }

  return res.status(405).json({ error: 'Metóda nie je povolená' });
}
