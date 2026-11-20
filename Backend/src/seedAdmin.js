import 'dotenv/config';
import argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

const { database } = await import('./database.js');

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(14).max(128),
});

try {
  const { email, password } = credentialsSchema.parse({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  const existingAdmin = database.prepare('SELECT 1 FROM admins LIMIT 1').get();
  if (existingAdmin) throw new Error('An administrator already exists; refusing to create another account.');

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  database.prepare('INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(randomUUID(), email.toLowerCase(), passwordHash, new Date().toISOString());
  console.log(`Administrator created for ${email.toLowerCase()}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Unable to create administrator.');
  process.exitCode = 1;
} finally {
  database.close();
}
