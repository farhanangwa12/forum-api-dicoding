const ReplyCommentRepository = require('../../Domains/reply_comment/ReplyCommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
class ReplyCommentRepositoryPostgres extends ReplyCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;

    this._idGenerator = idGenerator;
  }

  async addReplyCommentThread(comment) {


    const { referenceCommentId, replyCommentId } = comment;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: `
        INSERT INTO reply_comments (id, "referenceCommentId", "replyCommentId")
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [id, referenceCommentId, replyCommentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getAllReplyByCommentId(commentId) {

    const query = {
      text: `
        SELECT reply_comments.id, users.username AS username,
               thread_comments."createdAt" AS date,
               thread_comments.content, thread_comments."isDelete"
        FROM thread_comments
        LEFT JOIN users ON users.id = thread_comments.owner
        LEFT JOIN reply_comments ON reply_comments."referenceCommentId" = thread_comments.id
        WHERE reply_comments."replyCommentId" = $1
        ORDER BY thread_comments."createdAt" ASC
      `,
      values: [commentId],
    };


    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkReplyComment(replyId) {
    const query = {
      text: `
        SELECT id, "referenceCommentId", "replyCommentId"
        FROM reply_comments
        WHERE id = $1
      `,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');

    }
    return result.rows[0];
  }

}
module.exports = ReplyCommentRepositoryPostgres;