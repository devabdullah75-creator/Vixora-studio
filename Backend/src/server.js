import 'dotenv/config';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { createApp } = await import('./app.js');
const { database } = await import('./database.js');
const port = Number(process.env.PORT ?? 4174);
const app = createApp();
const server = app.listen(port, () => {
  console.log(`Vixora Store API listening on port ${port}.`);
});

const shutdown = () => {
  server.close(() => {
    database.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default server;

if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? '')).href) {
  server.on('error', (error) => {
    console.error('Unable to start the Vixora Store API.', error);
    process.exitCode = 1;
  });
}
