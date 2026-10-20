import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

// Открываем базу данных SQLite в файле dev.db
const db = new sqlite3.Database('./dev.db', (err) => {
  if (err) console.error('Error opening database', err.message);
  else console.log('Connected to SQLite database.');
});

// Создаем таблицы, если их нет
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sentiment TEXT DEFAULT 'neutral',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    projectId TEXT,
    FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
  )`);
});

// GET /api/v1/projects - получить все проекты вместе с фидбеками
app.get('/api/v1/projects', (req, res) => {
  db.all(`SELECT * FROM projects`, [], (err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(`SELECT * FROM feedbacks`, [], (err, feedbacks) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const result = projects.map(p => ({
        ...p,
        feedbacks: feedbacks.filter(f => f.projectId === p.id)
      }));
      res.json(result);
    });
  });
});

// POST /api/v1/projects - создать проект
app.post('/api/v1/projects', (req, res) => {
  const { name, description } = req.body;
  const id = Date.now().toString();
  db.run(`INSERT INTO projects (id, name, description) VALUES (?, ?, ?)`, [id, name, description], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id, name, description });
  });
});

// POST /api/v1/projects/:id/feedbacks - добавить отзыв
app.post('/api/v1/projects/:id/feedbacks', (req, res) => {
  const { content, category } = req.body;
  const id = Date.now().toString();
  const sentiment = category === 'bug' ? 'negative' : category === 'praise' ? 'positive' : 'neutral';
  const projectId = req.params.id;

  db.run(`INSERT INTO feedbacks (id, content, category, sentiment, projectId) VALUES (?, ?, ?, ?, ?)`, 
    [id, content, category || 'general', sentiment, projectId], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id, content, category, sentiment, projectId });
    });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
