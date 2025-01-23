import { serve } from '@hono/node-server';
import { app } from './server.js';

async function main() {
  serve({
    fetch: app.fetch,
    port: 3000,
  })
  console.log('🚀 Server started on port 3000');
}

main().catch((err) => {
  console.error(err);
});
