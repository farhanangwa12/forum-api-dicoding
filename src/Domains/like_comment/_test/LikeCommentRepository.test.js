const LikeCommentRepository = require('../LikeCommentRepository');
describe('LikeCommentRepository', () => {
  it('should throw LIKE_COMMENT.METHOD_NOT_IMPLEMENTED error', async () => {
    // Arrange
    const mockLikeCommentRepository = new LikeCommentRepository();

    // Action and arrange
    await expect(mockLikeCommentRepository.checkLikeComment('user-123', 'comment-123')).rejects.toThrow('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(mockLikeCommentRepository.likeComment('user-123', 'comment-123')).rejects.toThrow('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(mockLikeCommentRepository.unlikeComment('user-123', 'comment-123')).rejects.toThrow('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(mockLikeCommentRepository.getLikeCountByCommentId('comment-123')).rejects.toThrow('LIKE_COMMENT.METHOD_NOT_IMPLEMENTED');
  });

});