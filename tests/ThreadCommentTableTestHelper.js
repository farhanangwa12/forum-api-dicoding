/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');


const ThreadCommentTableTestHelper = {
  async addThreadComment({
    id = 'comment-123',
    content = 'A test comment',
    owner = 'user-123',
    threadId = 'thread-123',
    createdAt = new Date(Date.now()),
    updatedAt = new Date(Date.now()),
    isDelete = false

  }) {



    const query = {
      text: 'INSERT INTO thread_comments (id, content, owner, "threadId", "createdAt", "updatedAt", "isDelete") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, owner, threadId, createdAt, updatedAt, isDelete]
    };
    await pool.query(query);
  },

  async findThreadCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id]
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async addReplyCommentThread({ id = 'reply-123', referenceCommentId = 'comment-123', replyCommentId = '124' }) {
    const query = {
      text: 'INSERT INTO reply_comments (id, "referenceCommentId", "replyCommentId") VALUES ($1, $2, $3)',
      values: [id, referenceCommentId, replyCommentId]
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
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  }
};

module.exports = ThreadCommentTableTestHelper;