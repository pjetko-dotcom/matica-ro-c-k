import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Data storage
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Save data
app.post('/api/sync/:code', (req, res) => {
  try {
    const { code } = req.params;
    if (!code || code.length < 2) {
      return res.status(400).json({ error: 'Kód musí mať minimálne 2 znaky' });
    }

    const sanitizedCode = code.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_DIR, `${sanitizedCode}.json`);
    fs.writeFileSync(filePath, JSON.stringify(req.body), 'utf8');
    
    res.json({ success: true, message: 'Dáta uložené' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Chyba pri ukladaní' });
  }
});

// Load data
app.get('/api/sync/:code', (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: 'Kód je povinný' });
    }

    const sanitizedCode = code.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_DIR, `${sanitizedCode}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Nič sa nenašlo' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ error: 'Chyba pri sťahovaní' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
