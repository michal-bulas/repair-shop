import { migrate } from 'drizzle-orm/neon-http/migrator';

import { db } from '@/server/db';

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: 'src/server/db/migrations'
    });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration: ', error);
    process.exit(1);
  }
};

main();