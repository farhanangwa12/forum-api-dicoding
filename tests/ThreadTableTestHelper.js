/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async addThread({
    id = 'thread-123', // Simple ID generator for testing
    title = 'Test Thread',
    body = 'This is a test thread body',
    owner = 'user-123',
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    const query = {
      text: 'INSERT INTO thread (id, title, body, owner, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, updatedAt]
    };
    const result = await pool.query(query);
    return result.rows[0]; // Return the inserted thread's id, title, owner
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [id]
    };
    const result = await pool.query(query);
    return result.rows[0]; // Return the thread if found, undefined if not
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread WHERE 1=1');
  }
};

module.exports = ThreadTableTestHelper;