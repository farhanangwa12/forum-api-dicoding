const CreateThread = require('../../../Domains/thread/entities/CreateThread');
const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CreatedThread = require('../../../Domains/thread/entities/CreatedThread');
describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'A Thread Title',
      body: 'This is the thread body',
    };

    const createdThread = new CreateThread(useCasePayload);


    const expectedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId

    });

    // Mock dependencies
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(new CreatedThread({
        id: 'thread-123',
        title: 'A Thread Title',
        owner: 'user-123',
      }))
    );

    // Create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith({ ...createdThread, owner: userId });

  });
});