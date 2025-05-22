

// const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const CreatedThread = require('../../Domains/thread/entities/CreatedThread');
class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;

  }

  async addThread(thread) {


    const { title, body, owner } = thread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date(Date.now());
    const query = {
      text: 'INSERT INTO thread (id, title, body, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, createdAt]
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });

  }

  async detailThread(threadId) {
    const query = {
      text: `
                SELECT t.id, t.title, t.body, t.created_at AS date, u.username
                FROM thread t
                LEFT JOIN users u ON u.id = t.owner
                WHERE t.id = $1
            `,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async checkThread(threadId) {
    const query = {
      text: 'SELECT id FROM thread WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

}

module.exports = ThreadRepositoryPostgres;