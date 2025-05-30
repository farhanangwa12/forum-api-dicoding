const CreateCommentThread = require('../../Domains/thread_comment/entities/CreateCommentThread');

class AddReplyCommentThreadUseCase {

  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;

    this._threadCommentRepository = threadCommentRepository;

  }

  async execute(useCasePayload) {

    const createdCommentThread = new CreateCommentThread(useCasePayload);

    await this._threadRepository.checkThread(createdCommentThread.threadId);

    await this._threadCommentRepository.checkThreadComment(useCasePayload.commentId);
    const addedComment = await this._threadCommentRepository.addCommentThread({ content: createdCommentThread.content, owner: createdCommentThread.owner, threadId: useCasePayload.threadId });
    const replyComment =  await this._threadCommentRepository.addReplyCommentThread({ replyCommentId: useCasePayload.commentId, referenceCommentId: addedComment.id });

    return { ...addedComment, id: replyComment.id, };



  }

}

module.exports = AddReplyCommentThreadUseCase;