const ThreadRepository = require('../ThreadRepository');



describe('ThreadRepository', () => {
  it('should throw THREAD_REPOSITORY.METHOD_NOT.IMPLEMENTED error when addThread is called', async () => {


    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.detailThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.checkThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

});