/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');


const ThreadCommentTableTestHelper = {
  async addThreadComment({
    id = 'comment-123',
    content = 'A test comment',
    owner = 'user-123',
    thread_id = 'thread-123',
    created_at = new Date(Date.now()),
    updated_at = new Date(Date.now()),
    is_delete = false

  }) {



    const query = {
      text: 'INSERT INTO thread_comments (id, content, owner, thread_id, created_at, updated_at, is_delete) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, owner, thread_id, created_at, updated_at, is_delete]
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

  async addReplyCommentThread({ id = 'reply-123', reference_comment_id = 'comment-123', reply_comment_id = '124' }) {
    const query = {
      text: 'INSERT INTO reply_comments (id, reference_comment_id, reply_comment_id) VALUES ($1, $2, $3)',
      values: [id, reference_comment_id, reply_comment_id]
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async checkReplyComment(replyId) {
    const query = {
      text: 'SELECT id, reference_comment_id, reply_comment_id FROM reply_comments WHERE id = $1',
      values: [replyId]
    };

    const result = await pool.query(query);
    return result.rows[0];
  },



  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  }
};

module.exports = ThreadCommentTableTestHelper;