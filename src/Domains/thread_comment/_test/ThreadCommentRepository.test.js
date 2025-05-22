const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED error', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action & Assert
    await expect(threadCommentRepository.addCommentThread({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');

    await expect(threadCommentRepository.deleteCommentThread('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.checkThreadComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.addReplyCommentThread({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.getAllReplyByCommentId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
    await expect(threadCommentRepository.checkReplyComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  });
});