/**
 * Prep-Ex.: Creating a Web Server
 */

import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

const basePath = process.cwd();

app.get('/', (req, res) => {
  res.sendFile(path.join(basePath, 'index.html'));
});

app.get('/index.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(basePath, 'index.js'));
});

app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(basePath, 'style.css'));
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
