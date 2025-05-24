
class DeleteReplyCommentThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;

  }

  async execute(useCasePayload) {

    await this._threadRepository.checkThread(useCasePayload.threadId);
    const dataReply = await this._threadCommentRepository.checkReplyComment(useCasePayload.replyId);

    const commentThread = await this._threadCommentRepository.checkThreadComment(dataReply.reference_comment_id);

    if (commentThread.owner !== useCasePayload.userId) {
      throw new Error('DELETE_REPLY_COMMENT_THREAD.UNAUTHORIZED_USER_ACTION_ON_REPLY_COMMENT_THREAD');
    }

    if (commentThread.is_delete) {
      throw new Error('DELETE_REPLY_COMMENT_THREAD.REFERENCE_COMMENT_NOT_FOUND_OR_ALREADY_DELETED');
    }
    await this._threadCommentRepository.deleteCommentThread(dataReply.reference_comment_id);
  }
}

module.exports = DeleteReplyCommentThreadUseCase;