const LikeCommentRepository = require('../../Domains/like_comment/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;

    this._idGenerator = idGenerator;
  }

  async unlikeComment(userId, commentId) {



    const query = {
      text: `
        DELETE FROM likes_comment
        WHERE "userId" = $1 AND "commentId" = $2
      `,
      values: [userId, commentId],
    };

    await this._pool.query(query);

  }

  async likeComment(userId, commentId) {
    const id = `like-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: `
        INSERT INTO likes_comment (id, "userId", "commentId", "createdAt")
        VALUES ($1, $2, $3, $4)
      `,
      values: [id, userId, commentId, createdAt],
    };

    await this._pool.query(query);
  }

  async checkLikeComment(userId, commentId) {



    const query = {
      text: `
        SELECT id FROM likes_comment
        WHERE "userId" = $1 AND "commentId" = $2
      `,
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      return result.rows[0].id;
    }

    return 0;

  }
  async getLikeCountByCommentId(commentId) {
    const query = {
      text: `
        SELECT COUNT(*) AS like_count
        FROM likes_comment
        WHERE "commentId" = $1
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].like_count, 10); // konversi dari string ke integer
  }

}

module.exports = LikeCommentRepositoryPostgres;