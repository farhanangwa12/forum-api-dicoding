const ReplyCommentRepository = require('../ReplyCommentRepository');

describe('ReplyCommentRepository', () => {
  it('should throw REPLY_COMMENT.METHOD_NOT_IMPLEMENTED error', async  () => {
    // Arrange
    const replyCommentRepository = new ReplyCommentRepository();

    // Action & Assert
    await expect(replyCommentRepository.addReplyCommentThread({}))
      .rejects
      .toThrowError('REPLY_COMMENT.METHOD_NOT_IMPEMENTED');
    await expect(replyCommentRepository.getAllReplyByCommentId(''))
      .rejects
      .toThrowError('REPLY_COMMENT.METHOD_NOT_IMPEMENTED');
    await expect(replyCommentRepository.checkReplyComment(''))
      .rejects
      .toThrowError('REPLY_COMMENT.METHOD_NOT_IMPEMENTED');

  });
});