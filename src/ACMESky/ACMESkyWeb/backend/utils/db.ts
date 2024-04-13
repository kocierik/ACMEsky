import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'pg',
  password: process.env.POSTGRES_PASSWORD || 'pass',
  database: process.env.POSTGRES_DB || 'acmesky',
  host: process.env.POSTGRES_HOST || 'acmesky_db',
  port: 5432,
});

export default pool

