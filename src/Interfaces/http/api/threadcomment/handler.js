const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');
const AddReplyCommentThreadUseCase = require('../../../../Applications/use_case/AddReplyCommentThreadUseCase');
const DeleteReplyCommentThreadUseCase = require('../../../../Applications/use_case/DeleteReplyCommentThreadUseCase');

class ThreadCommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.addReplyCommentHandler = this.addReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {

    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addCommentThreadUseCase = this._container.getInstance(AddCommentThreadUseCase.name);

    const addedComment = await addCommentThreadUseCase.execute({ threadId, owner, ...request.payload });

    return h.response({
      status: 'success',
      data: {
        addedComment: addedComment
      }
    }).code(201);


  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const deleteCommentThreadUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);
    await deleteCommentThreadUseCase.execute({ threadId, commentId, userId });

    return h.response({
      status: 'success'
    }).code(200);
  }

  async addReplyCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const addReplyCommentThreadUseCase = this._container.getInstance(AddReplyCommentThreadUseCase.name);
    const addedReply = await addReplyCommentThreadUseCase.execute({ threadId, commentId, owner: userId, ...request.payload });

    return h.response({
      status: 'success',
      data: {
        addedReply: addedReply
      }
    }).code(201);
  }
  async deleteReplyCommentHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: userId } = request.auth.credentials;

    const deleteReplyCommentThreadUseCase = this._container.getInstance(DeleteReplyCommentThreadUseCase.name);
    await deleteReplyCommentThreadUseCase.execute({ threadId, commentId, replyId, userId });

    return h.response({
      status: 'success'
    }).code(200);
  }
}

module.exports = ThreadCommentHandler;