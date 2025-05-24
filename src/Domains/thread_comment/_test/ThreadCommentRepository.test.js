const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED error', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action & Assert
    await expect(threadCommentRepository.addCommentThread({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.deleteCommentThread('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.checkThreadComment('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.getAllCommentByThreadId('thread-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.addReplyCommentThread({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.getAllReplyByCommentId('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.checkReplyComment('reply-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  });
});