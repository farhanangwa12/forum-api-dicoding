const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteReplyCommentThreadUseCase = require('../DeleteReplyCommentThreadUseCase');

describe('DeleteReplyCommentThreadUseCase', () => {



  it('should orchestrate the delete reply comment action correctly', async () => {
    // Arrange

    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();


    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'thread-123'
      });
    });

    mockThreadCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'reply-123',
        reference_comment_id: 'comment-124',
        reply_comment_id: 'comment-123',
      });
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'comment-124',
        content: 'This is a comment',
        owner: 'user-123',
        is_delete: false,
      });
    });

    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });


    const deleteReplyCommentThreadUseCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteReplyCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).toBeCalledWith('comment-124');
  });


  it('should throw error when user is not the owner of the comment thread', async () => {
    // Arrange

    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      userId: 'user-456',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();


    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'thread-123'
      });
    });

    mockThreadCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'reply-123',
        reference_comment_id: 'comment-124',
        reply_comment_id: 'comment-123',
      });
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'comment-124',
        content: 'This is a comment',
        owner: 'user-123',
        is_delete: false,
      });
    });



    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockResolvedValue();

    const deleteReplyCommentThreadUseCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyCommentThreadUseCase.execute(useCasePayload)
    ).rejects.toThrow('DELETE_REPLY_COMMENT_THREAD.UNAUTHORIZED_USER_ACTION_ON_REPLY_COMMENT_THREAD');

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).not.toBeCalled();
  });

  it('should throw error when the reply comment is not found', async () => {
    // Arrange

    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      userId: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();


    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      Promise.resolve({
        id: 'thread-123'
      });

    });
    mockThreadCommentRepository.checkReplyComment = jest.fn().mockResolvedValue({
      id: 'reply-123',
      reference_comment_id: 'comment-124',
      reply_comment_id: 'comment-123',
    });
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockResolvedValue({
      id: 'comment-124',
      content: 'This is a comment',
      owner: 'user-123',
      is_delete: true,
    });


    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockResolvedValue();

    const deleteReplyCommentThreadUseCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyCommentThreadUseCase.execute(useCasePayload)
    ).rejects.toThrow('DELETE_REPLY_COMMENT_THREAD.REFERENCE_COMMENT_NOT_FOUND_OR_ALREADY_DELETED');

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).not.toBeCalled();

  });
});
