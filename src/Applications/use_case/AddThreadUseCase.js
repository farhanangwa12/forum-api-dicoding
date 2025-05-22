// const CreatedThread = require('./CreatedThread');
const CreateThread = require('../../Domains/thread/entities/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const createdThread = new CreateThread(useCasePayload);
    return this._threadRepository.addThread({ ...createdThread, owner: userId });
  }
}

module.exports = AddThreadUseCase;