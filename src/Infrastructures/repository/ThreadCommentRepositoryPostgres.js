
const ThreadCommentRepository = require('../../Domains/thread_comment/ThreadCommentRepository');
const CreatedCommentThread = require('../../Domains/thread_comment/entities/CreatedCommentThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;

    this._idGenerator = idGenerator;
  }

  async addCommentThread(comment) {

    const { content, owner, threadId } = comment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date(Date.now());

    const query = {
      text: `
        INSERT INTO thread_comments
        (id, content, owner, "threadId", "createdAt", "updatedAt", "isDelete")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, content, owner
      `,
      values: [id, content, owner, threadId, createdAt, createdAt, 0],
    };

    const result = await this._pool.query(query);


    return new CreatedCommentThread({ ...result.rows[0] });




  }
  async deleteCommentThread(commentId) {
    const updatedAt = new Date(Date.now());
    const query = {
      text: `
        UPDATE thread_comments
        SET "isDelete" = $1, "updatedAt" = $2
        WHERE id = $3
      `,
      values: [1, updatedAt, commentId],
    };

    await this._pool.query(query);

  }

  async checkThreadComment(commentId) {
    const query = {
      text: `
        SELECT id, content, owner, "isDelete"
        FROM thread_comments
        WHERE id = $1
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');

    }

    return result.rows[0];
  }

  async getAllCommentByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          tc.id,
          u.username AS username,
          tc."createdAt" AS date,
          tc.content,
          tc."isDelete"
        FROM thread_comments tc
        LEFT JOIN users u ON u.id = tc.owner
        LEFT JOIN reply_comments ON reply_comments."referenceCommentId" = tc.id
        WHERE tc."threadId" = $1 AND reply_comments."referenceCommentId" IS NULL
        ORDER BY tc."createdAt" ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }






}

module.exports = ThreadCommentRepositoryPostgres;