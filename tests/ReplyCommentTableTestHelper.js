/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');



const ReplyCommentTableTestHelper = {
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
        await pool.query('DELETE FROM reply_comments WHERE 1=1');
    }

}

module.exports = ReplyCommentTableTestHelper;