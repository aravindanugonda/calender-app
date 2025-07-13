import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('Missing database credentials in environment variables');
  process.exit(1);
}

async function runMigration() {
  try {
    const client = createClient({
      url: TURSO_DATABASE_URL as string,
      authToken: TURSO_AUTH_TOKEN as string
    });

    console.log('Running migrations...');

    // Read and execute the migration SQL file
    const migrationSQL = fs.readFileSync(
      path.join(process.cwd(), 'src/drizzle/migrations/0000_initial.sql'),
      'utf-8'
    );

    // Split the SQL file into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await client.execute(statement + ';');
      console.log('Executed:', statement.substring(0, 50) + '...');
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration().catch(console.error);
