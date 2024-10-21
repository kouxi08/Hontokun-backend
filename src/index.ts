import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import Request from './microcms'

const app = new Hono()
import { config } from 'dotenv';

config();


app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.get('/test',  async (c) => {
  try {
    const message = await Request();
    return c.text(`test: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error("Error in /test route:", error);
    return c.text("Failed to fetch quiz data");
  }
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
});
