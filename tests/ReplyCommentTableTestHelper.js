/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');



const ReplyCommentTableTestHelper = {
  async addReplyCommentThread({ id = 'reply-123', referenceCommentId = 'comment-123', replyCommentId = '124' }) {
    const query = {
      text: `
        INSERT INTO reply_comments
        (id, "referenceCommentId", "replyCommentId")
        VALUES ($1, $2, $3)
      `,
      values: [id, referenceCommentId, replyCommentId],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async checkReplyComment(replyId) {
    const query = {
      text: `
        SELECT id, "referenceCommentId", "replyCommentId"
        FROM reply_comments
        WHERE id = $1
      `,
      values: [replyId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM reply_comments WHERE 1=1');
  }

};

module.exports = ReplyCommentTableTestHelper;