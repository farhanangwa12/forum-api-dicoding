/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeCommentTableTestHelper = {
  async addLikeComment({
    id = 'like-123',
    userId = 'user-123',
    commentId = 'comment-123',
    createdAt = new Date(Date.now()),
  }) {
    const query = {
      text: `
        INSERT INTO likes_comment (id, "userId", "commentId", "createdAt")
        VALUES ($1, $2, $3, $4)
      `,
      values: [id, userId, commentId, createdAt],
    };
    await pool.query(query);
  },



  async checkLikeCommentByUserAndComment({ userId, commentId }) {
    const query = {
      text: `
        SELECT * FROM likes_comment
        WHERE "userId" = $1 AND "commentId" = $2
      `,
      values: [userId, commentId],
    };
    const result = await pool.query(query);
    console.log(result.rows);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment');
  },
};

module.exports = LikeCommentTableTestHelper;
