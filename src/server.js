import express from 'express';
import { requestHandler } from './requestHandler';

const PORT = 3000;

express()
  .get('/', requestHandler)
  .listen(PORT, () => console.info(`Available on http://localhost:${PORT}`));
