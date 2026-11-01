const { Pool } = require('pg');
require('dotenv').config();

const connectionConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || '127.0.0.1',
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE || 'fishconnect_db',
    };

const pool = new Pool({
  ...connectionConfig,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// Keep the existing handlers' result shape while running parameterized PostgreSQL queries.
function postgresPlaceholders(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

async function query(executor, sql, values = []) {
  const isInsert = /^\s*INSERT\b/i.test(sql);
  const statement = postgresPlaceholders(sql);
  const result = await executor.query(
    isInsert && !/\bRETURNING\b/i.test(statement) ? `${statement} RETURNING id` : statement,
    values,
  );
  return [result.rows, { insertId: result.rows[0]?.id }];
}

const db = {
  query: (sql, values) => query(pool, sql, values),
  execute: (sql, values) => query(pool, sql, values),
  getConnection: async () => {
    const client = await pool.connect();
    return {
      query: (sql, values) => query(client, sql, values),
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
      release: () => client.release(),
    };
  },
  end: () => pool.end(),
};

module.exports = db;
