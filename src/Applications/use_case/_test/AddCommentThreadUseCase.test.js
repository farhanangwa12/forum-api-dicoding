const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');
const CreateCommentThread = require('../../../Domains/thread_comment/entities/CreateCommentThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const CreatedCommentThread = require('../../../Domains/thread_comment/entities/CreatedCommentThread');
describe('AddCommentThreadUseCase', () => {
  it('should orchestrate the add comment thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    const expectedComment = {
      id: 'comment-123',
      content: 'This is a comment',
      owner: 'user-123',
    };


    // Mock Dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();




    // Mock dependencies behavior
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123'
    }));
    mockThreadCommentRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve(
      new CreatedCommentThread({
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123'
      })));

    // Action
    const addCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    });


    const result = await addCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(new CreatedCommentThread(expectedComment));
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.addCommentThread).toBeCalledWith(useCasePayload);



  });

});