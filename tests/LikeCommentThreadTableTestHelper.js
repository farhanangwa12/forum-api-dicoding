/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeCommentTableTestHelper = {
    async addLikeComment({
        id = 'like-123',
        user_id = 'user-123',
        comment_id = 'comment-123',
        created_at = new Date(Date.now()),
    }) {
        const query = {
            text: 'INSERT INTO likes_comment (id, user_id, comment_id, created_at) VALUES ($1, $2, $3, $4)',
            values: [id, user_id, comment_id, created_at],
        };
        await pool.query(query);
    },

  

    async checkLikeCommentByUserAndComment({ userId, commentId }) {
        const query = {
            text: 'SELECT * FROM likes_comment WHERE user_id = $1 AND comment_id = $2',
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
