const AddReplyCommentThreadUseCase = require('../AddReplyCommentThreadUseCase');
const CreateCommentThread = require('../../../Domains/thread_comment/entities/CreateCommentThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');



describe('AddReplyCommentThreadUseCase', () => {

  it('should orchestrating the add reply comment correctly', async () => {

    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'this is content',
      owner: 'user-123'

    };
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'comment-124',
      content: 'this is content',
      owner: 'user-123'

    }));
    mockThreadCommentRepository.addReplyCommentThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'reply-123',
    }));


    const addReplyCommentThreadUseCase = new AddReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    });

    // Action
    const result = await addReplyCommentThreadUseCase.execute(useCasePayload);

    // Assert

    expect(result).toEqual({
      id: 'reply-123', // ID dari replyComment
      content: 'this is content',
      owner: 'user-123',
    });
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentRepository.addCommentThread).toBeCalledWith({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    });
    expect(mockThreadCommentRepository.addReplyCommentThread).toBeCalledWith({
      replyCommentId: useCasePayload.commentId,
      referenceCommentId: 'comment-124', // ID dari addedComment
    });




  });
});
