import { serve } from '@hono/node-server';
import { app } from './server.js';
import { hc } from 'hono/client';

const client = hc<typeof app>("");
export type Client = typeof client;
export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<typeof app>(...args)

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
