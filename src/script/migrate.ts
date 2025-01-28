import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from '../server.js';

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migration completed.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

main();
