import 'dotenv/config';
import { app } from './app.js';
import { prisma } from './lib.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;

  const server = app.listen(port, () => {
    console.log(`ClientFlow API running on port ${port}`);
  });

  process.on('SIGTERM', async () => {
    server.close();
    await prisma.$disconnect();
  });
}

export default app;
