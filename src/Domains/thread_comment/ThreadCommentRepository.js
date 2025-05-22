class ThreadCommentRepository {
  async addCommentThread(comment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }

  async deleteCommentThread(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }
  async checkThreadComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }

  async getAllCommentByThreadId(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }

  async addReplyCommentThread(comment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }
  async getAllReplyByCommentId(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }
  async checkReplyComment(replyId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPEMENTED');
  }
}

module.exports = ThreadCommentRepository;