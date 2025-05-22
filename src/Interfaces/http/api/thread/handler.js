const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadHandler {
  constructor(container) {


    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {

    const { id: userId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(userId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: addedThread
      }
    });
    response.code(201);
    return response;



  }

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params;

    // Instantiate use case from container
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);

    // Execute use case
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Return response
    return h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    }).code(200);
  }
}

module.exports = ThreadHandler;