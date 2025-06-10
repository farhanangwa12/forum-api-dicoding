
class DeleteCommentThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkThread(useCasePayload.threadId);
    const commentThread = await this._threadCommentRepository.checkThreadComment(useCasePayload.commentId);
    if (commentThread.owner !== useCasePayload.owner) {
      throw new Error('DELETE_COMMENT_THREAD.UNAUTHORIZED_USER_ACTION_ON_THREAD_COMMENT');
    }
    if (commentThread.isDelete) {
      // throw new NotFoundError('Komentar tidak ada');
      throw new Error('DELETE_COMMENT_THREAD.COMMENT_NOT_FOUND');
    }
    await this._threadCommentRepository.deleteCommentThread(useCasePayload.commentId);

  }



}

module.exports = DeleteCommentThreadUseCase;