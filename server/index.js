const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 8080;
mongoose.connect("mongodb://mongodb:27017/INTERVIEW");
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
const db = mongoose.connection;

const api = require('./mongo/controllers');
const models = require('./mongo/model')(mongoose);

db.on('error', console.error.bind(console, 'error connection to database'));
db.once('open', function () {

  app.get('/api/interviews/:id', (req, res) => api.getInterview({ req, res, models }));
  app.get('/api/interviews', (req, res) => api.getInterviews({ req, res, models }));
  app.get('/api/projects', (req, res) => api.getProjects({ req, res, models }));
  app.get('/api/projects/:project', (req, res) => api.getProject({ req, res, models }));
  app.put('/api/projects', (req, res) => api.putProject({ req, res, models }));
  app.put('/api/projects/:id', (req, res) => api.changeProject({ req, res, models }));
  app.put('/api/interviews/:id', (req, res) => api.changeInterview({ req, res, models }));
  app.put('/api/interviews', (req, res) => api.putInterview({ req, res, models }));
  app.put('/api/atoms', (req, res) => api.putAtom({ req, res, models }));
  app.options('/api/atoms', (req, res) => api.changeAtom({ req, res, models }));
  app.delete('/api/atoms', (req, res) => api.deleteAtom({ req, res, models }));
  app.delete('/api/projects', (req, res) => api.deleteProject({ req, res, models }));
  app.delete('/api/interviews', (req, res) => api.deleteInterview({ req, res, models }));

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
});

