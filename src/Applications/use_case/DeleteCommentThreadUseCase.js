const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
class DeleteCommentThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkThread(useCasePayload.threadId);
    const commentThread = await this._threadCommentRepository.checkThreadComment(useCasePayload.commentId);
    if (commentThread.owner !== useCasePayload.userId) {
      throw new AuthorizationError('Anda tidak berhak terhadap resource ini');
    }
    if (commentThread.is_delete) {
      throw new NotFoundError('Komentar tidak ada');
    }
    await this._threadCommentRepository.deleteCommentThread(useCasePayload.commentId);

  }



}

module.exports = DeleteCommentThreadUseCase;