
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
      text: 'INSERT INTO thread_comments (id, content, owner, thread_id, created_at, updated_at, is_delete) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, owner, threadId, createdAt, createdAt, 0]
    };

    const result = await this._pool.query(query);


    return new CreatedCommentThread({ ...result.rows[0] });




  }
  async deleteCommentThread(commentId) {
    const updatedAt = new Date(Date.now());
    const query = {
      text: 'UPDATE thread_comments SET is_delete = $1, updated_at = $2 WHERE id = $3',
      values: [1, updatedAt, commentId]
    };

    await this._pool.query(query);

  }

  async checkThreadComment(commentId) {
    const query = {
      text: 'SELECT id, content, owner, is_delete FROM thread_comments WHERE id = $1',
      values: [commentId]
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
            SELECT tc.id, u.username AS username, tc.created_at AS date,
                   CASE WHEN tc.is_delete = true THEN '**komentar telah dihapus**' ELSE tc.content END AS content
            FROM thread_comments tc
            LEFT JOIN users u ON u.id = tc.owner
            LEFT JOIN reply_comments ON reply_comments.reference_comment_id = tc.id
            WHERE tc.thread_id = $1 AND reply_comments.reference_comment_id IS NULL
            ORDER BY tc.created_at ASC
        `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }


  async addReplyCommentThread(comment) {


    const { referenceCommentId, replyCommentId } = comment;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO reply_comments (id, reference_comment_id, reply_comment_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, referenceCommentId, replyCommentId]
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getAllReplyByCommentId(commentId) {

    const query = {
      text: `
            SELECT reply_comments.id, users.username AS username, thread_comments.created_at AS date,
                   CASE WHEN thread_comments.is_delete = true THEN '**balasan telah dihapus**' ELSE thread_comments.content END AS content
            FROM thread_comments thread_comments
            LEFT JOIN users  ON users.id = thread_comments.owner
            LEFT JOIN reply_comments ON reply_comments.reference_comment_id = thread_comments.id
            WHERE reply_comments.reply_comment_id = $1 
            ORDER BY thread_comments.created_at ASC
        `,
      values: [commentId],
    };


    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkReplyComment(replyId) {
    const query = {
      text: 'SELECT id, reference_comment_id, reply_comment_id FROM reply_comments WHERE id = $1',
      values: [replyId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');

    }
    return result.rows[0];
  }





}

module.exports = ThreadCommentRepositoryPostgres;