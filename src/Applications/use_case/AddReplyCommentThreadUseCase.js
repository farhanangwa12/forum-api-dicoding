const CreateCommentThread = require('../../Domains/thread_comment/entities/CreateCommentThread');

class AddReplyCommentThreadUseCase {

  constructor({ threadRepository, threadCommentRepository, replyCommentRepository }) {
    this._threadRepository = threadRepository;

    this._threadCommentRepository = threadCommentRepository;

    this._replyCommentRepository = replyCommentRepository;

  }

  async execute(useCasePayload) {



    await this._threadRepository.checkThread(useCasePayload.threadId);
    const createdCommentThread = new CreateCommentThread(useCasePayload);
    await this._threadCommentRepository.checkThreadComment(useCasePayload.commentId);
    const addedComment = await this._threadCommentRepository.addCommentThread(createdCommentThread);
    const replyComment = await this._replyCommentRepository.addReplyCommentThread({ replyCommentId: useCasePayload.commentId, referenceCommentId: addedComment.id });

    return { ...addedComment, id: replyComment.id };



  }

}

module.exports = AddReplyCommentThreadUseCase;