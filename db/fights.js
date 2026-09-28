const searchable = {
  title: 'title',
  fighter: 'array_to_string(fighters, \' \')',
  arc: 'arc',
  format: 'format',
};

export function createFightRepository(pool) {
  return {
    async list({ attribute = 'title', q = '' } = {}) {
      if (!Object.hasOwn(searchable, attribute)) throw new TypeError('Unknown search attribute');
      // Treat %, _ and backslashes literally; user text is always a SQL parameter.
      const pattern = `%${q.replace(/[\\%_]/g, '\\$&')}%`;
      const result = await pool.query(
        `SELECT * FROM fights WHERE ${searchable[attribute]} ILIKE $1 ORDER BY rank ASC`, [pattern]);
      return result.rows;
    },
    async find(slug) {
      const result = await pool.query('SELECT * FROM fights WHERE slug = $1', [slug]);
      return result.rows[0];
    },
  };
}

export const searchAttributes = Object.keys(searchable);
