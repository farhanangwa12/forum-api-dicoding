const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');

class ThreadCommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);

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
    const { id: owner } = request.auth.credentials;

    const deleteCommentThreadUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);
    await deleteCommentThreadUseCase.execute({ threadId, commentId, owner });

    return h.response({
      status: 'success'
    }).code(200);
  }

  
}

module.exports = ThreadCommentHandler;