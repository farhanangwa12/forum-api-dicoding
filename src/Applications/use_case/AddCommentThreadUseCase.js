const CreateCommentThread = require('../../Domains/thread_comment/entities/CreateCommentThread');

class AddCommentThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const createdCommentThread = new CreateCommentThread(useCasePayload);
    await this._threadRepository.checkThread(createdCommentThread.threadId);
    const addedComment = await this._threadCommentRepository.addCommentThread(createdCommentThread);

    return addedComment;


  }
}

module.exports = AddCommentThreadUseCase;