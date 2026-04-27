import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

import fs from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Handle Contact Form submission
 */
app.post('/api/contacto', (req, res) => {
  // Save in the root of the project
  const contactFile = join(process.cwd(), 'contactos.json');
  const newContact = req.body;
  
  let contacts: any[] = [];
  try {
    if (fs.existsSync(contactFile)) {
      const fileData = fs.readFileSync(contactFile, 'utf8');
      if (fileData) {
        contacts = JSON.parse(fileData);
      }
    }
  } catch (e) {
    console.error('Error reading contacts file', e);
  }
  
  newContact.date = new Date().toISOString();
  contacts.push(newContact);
  
  try {
    fs.writeFileSync(contactFile, JSON.stringify(contacts, null, 2));
    res.status(201).json({ message: 'Contacto guardado exitosamente' });
  } catch (e) {
    console.error('Error writing to contacts file', e);
    res.status(500).json({ error: 'Error al guardar el contacto' });
  }
});

// Helper for experiencias
const experienciasFile = join(process.cwd(), 'public/data/experiencias.json');

function readExperiencias() {
  try {
    if (fs.existsSync(experienciasFile)) {
      const data = fs.readFileSync(experienciasFile, 'utf8');
      return data ? JSON.parse(data) : [];
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function writeExperiencias(data: any) {
  fs.writeFileSync(experienciasFile, JSON.stringify(data, null, 2));
}

app.get('/api/experiencias', (req, res) => {
  res.json(readExperiencias());
});

app.post('/api/experiencias', (req, res) => {
  const exps = readExperiencias();
  const newItem = req.body;
  newItem.id = exps.length > 0 ? Math.max(...exps.map((e: any) => e.id)) + 1 : 1;
  exps.push(newItem);
  writeExperiencias(exps);
  res.status(201).json(newItem);
});

app.put('/api/experiencias/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const exps = readExperiencias();
  const index = exps.findIndex((e: any) => e.id === id);
  if (index !== -1) {
    exps[index] = { ...req.body, id }; // ensure ID is preserved
    writeExperiencias(exps);
    res.json(exps[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/experiencias/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let exps = readExperiencias();
  const index = exps.findIndex((e: any) => e.id === id);
  if (index !== -1) {
    exps = exps.filter((e: any) => e.id !== id);
    writeExperiencias(exps);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
