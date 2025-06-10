
const AddReplyCommentThreadUseCase = require('../../../../Applications/use_case/AddReplyCommentThreadUseCase');
const DeleteReplyCommentThreadUseCase = require('../../../../Applications/use_case/DeleteReplyCommentThreadUseCase');

class ReplyCommentHandler {
  constructor(container) {

    this._container = container;
    this.addReplyCommentHandler = this.addReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async addReplyCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const addReplyCommentThreadUseCase = this._container.getInstance(AddReplyCommentThreadUseCase.name);
    const addedReply = await addReplyCommentThreadUseCase.execute({ threadId, commentId, owner, ...request.payload });

    return h.response({
      status: 'success',
      data: {
        addedReply: addedReply
      }
    }).code(201);
  }
  async deleteReplyCommentHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteReplyCommentThreadUseCase = this._container.getInstance(DeleteReplyCommentThreadUseCase.name);
    await deleteReplyCommentThreadUseCase.execute({ threadId, commentId, replyId, owner });

    return h.response({
      status: 'success'
    }).code(200);
  }
}
module.exports = ReplyCommentHandler;