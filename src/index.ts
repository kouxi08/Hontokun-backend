import { serve } from '@hono/node-server';
import { app } from './server.js';

async function main() {
  serve(app)
    .listen(3000)
    .once('listening', () => {
      console.log('🚀 Server started on port 3000');
    });
}

main().catch((err) => {
  console.error(err);
});
