import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/v1/projects - все проекты вместе с отзывами
app.get('/api/v1/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { feedbacks: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/projects - создать проект
app.post('/api/v1/projects', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const project = await prisma.project.create({ data: { name, description } });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/v1/projects/:id/feedbacks - добавить отзыв
app.post('/api/v1/projects/:id/feedbacks', async (req, res) => {
  const { content, category } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'content is required' });
  }
  const cat = category || 'general';
  const sentiment = cat === 'bug' ? 'negative' : cat === 'praise' ? 'positive' : 'neutral';
  try {
    const feedback = await prisma.feedback.create({
      data: { content, category: cat, sentiment, projectId: req.params.id },
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Собранный фронтенд (Vite) как статика
const dist = path.join(__dirname, 'dist');
app.use(express.static(dist));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
