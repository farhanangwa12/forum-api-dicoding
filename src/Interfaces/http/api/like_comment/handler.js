const DoLikeAndUnlikeCommentThreadUseCase = require('../../../../Applications/use_case/DoLikeAndUnlikeCommentThreadUseCase');
class LikeHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const likeCommentUseCase = this._container.getInstance(DoLikeAndUnlikeCommentThreadUseCase.name);
    await likeCommentUseCase.execute({ threadId, commentId, owner });

    return h.response({
      status: 'success'
    }).code(200);
  }
}

module.exports = LikeHandler;