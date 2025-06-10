
class DeleteReplyCommentThreadUseCase {
  constructor({ threadRepository, threadCommentRepository, replyCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCasePayload) {

    await this._threadRepository.checkThread(useCasePayload.threadId);
    const dataReply = await this._replyCommentRepository.checkReplyComment(useCasePayload.replyId);

    const commentThread = await this._threadCommentRepository.checkThreadComment(dataReply.referenceCommentId);

    if (commentThread.owner !== useCasePayload.owner) {
      throw new Error('DELETE_REPLY_COMMENT_THREAD.UNAUTHORIZED_USER_ACTION_ON_REPLY_COMMENT_THREAD');
    }

    if (commentThread.isDelete) {
      throw new Error('DELETE_REPLY_COMMENT_THREAD.REFERENCE_COMMENT_NOT_FOUND_OR_ALREADY_DELETED');
    }
    await this._threadCommentRepository.deleteCommentThread(dataReply.referenceCommentId);
  }
}

module.exports = DeleteReplyCommentThreadUseCase;