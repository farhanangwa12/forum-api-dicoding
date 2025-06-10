class LikeCommentRepository {
    async checkLikeComment(userId, commentId) {
        throw new Error('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');
    }
    async likeComment(userId, commentId) {
        throw new Error('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');

    }
    async unlikeComment(userId, commentId) {
        throw new Error('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');

    }
    async getLikeCountByCommentId(commentId) {
        throw new Error('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeCommentRepository;