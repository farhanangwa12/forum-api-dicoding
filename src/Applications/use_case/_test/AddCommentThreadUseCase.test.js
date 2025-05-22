const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');
const CreateCommentThread = require('../../../Domains/thread_comment/entities/CreateCommentThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');

describe('AddCommentThreadUseCase', () => {
  it('should orchestrate the add comment thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    const expectedComment = {
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    };


    // Mock Dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();




    // Mock dependencies behavior
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve(expectedComment.threadId));
    mockThreadCommentRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve(expectedComment));

    const createCommentThread = new CreateCommentThread(useCasePayload);

    // Action
    const addCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    });


    const result = await addCommentThreadUseCase.execute(expectedComment);

    // Assert

    expect(result).toEqual(expectedComment);
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.addCommentThread).toBeCalledWith(expectedComment);



  });

});