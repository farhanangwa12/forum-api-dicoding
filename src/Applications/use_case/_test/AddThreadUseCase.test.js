const CreateThread = require('../../../Domains/thread/entities/CreateThread');
const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'A Thread Title',
      body: 'This is the thread body',
    };
    const expectedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: userId,
    };

    // Mock dependencies
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(expectedThread)
    );

    // Create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(result).toEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: userId,
    });
  });
});