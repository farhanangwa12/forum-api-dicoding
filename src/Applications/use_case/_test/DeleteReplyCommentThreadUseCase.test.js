const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteReplyCommentThreadUseCase = require('../DeleteReplyCommentThreadUseCase');
const ReplyCommentRepository = require('../../../Domains/reply_comment/ReplyCommentRepository');

describe('DeleteReplyCommentThreadUseCase', () => {



  it('should orchestrate the delete reply comment action correctly', async () => {
    // Arrange

    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();


    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'thread-123'
      });
    });

    mockReplyCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'reply-123',
        referenceCommentId: 'comment-124',
        replyCommentId: 'comment-123',
      });
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'comment-124',
        content: 'This is a comment',
        owner: 'user-123',
        isDelete: false,
      });
    });

    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });


    const deleteReplyCommentThreadUseCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action
    await deleteReplyCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).toBeCalledWith('comment-124');
  });


  it('should throw Error when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-not-found',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Thread tidak ditemukan'));
    });

    mockReplyCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'reply-123',
        referenceCommentId: 'comment-124',
        replyCommentId: 'comment-123',
      });
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'comment-124',
        content: 'This is a comment',
        owner: 'user-123',
        isDelete: false,
      });
    });

    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const useCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload))
      .rejects.toThrowError(new Error('Thread tidak ditemukan'));

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyCommentRepository.checkReplyComment).not.toHaveBeenCalled();
    expect(mockThreadCommentRepository.checkThreadComment).not.toHaveBeenCalled();
    expect(mockThreadCommentRepository.deleteCommentThread).not.toHaveBeenCalled();
  });

  it('should throw Error when reply comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-not-found',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.resolve({ id: 'thread-123' });
    });

    mockReplyCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Balasan tidak ditemukan'));
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'comment-124',
        content: 'This is a comment',
        owner: 'user-123',
        isDelete: false,
      });
    });

    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const useCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload))
      .rejects.toThrowError(new Error('Balasan tidak ditemukan'));

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).not.toHaveBeenCalled();
    expect(mockThreadCommentRepository.deleteCommentThread).not.toHaveBeenCalled();
  });

  it('should throw Error when reference comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.resolve({ id: 'thread-123' });
    });

    mockReplyCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'reply-123',
        referenceCommentId: 'comment-124',
        replyCommentId: 'comment-123',
      });
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Komentar tidak ditemukan'));
    });

    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const useCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload))
      .rejects.toThrowError(new Error('Komentar tidak ditemukan'));

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).not.toHaveBeenCalled();
  });





  it('should throw error when user is not the owner of the comment thread', async () => {
    // Arrange

    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      owner: 'user-456',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();


    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'thread-123'
      });
    });

    mockReplyCommentRepository.checkReplyComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'reply-123',
        referenceCommentId: 'comment-124',
        replyCommentId: 'comment-123',
      });
    });

    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'comment-124',
        content: 'This is a comment',
        owner: 'user-123',
        isDelete: false,
      });
    });



    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockResolvedValue();

    const deleteReplyCommentThreadUseCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action & Assert
    await expect(
      deleteReplyCommentThreadUseCase.execute(useCasePayload)
    ).rejects.toThrow('DELETE_REPLY_COMMENT_THREAD.UNAUTHORIZED_USER_ACTION_ON_REPLY_COMMENT_THREAD');

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).not.toBeCalled();
  });

  it('should throw error when the reply comment is not found after it deleted', async () => {
    // Arrange

    const useCasePayload = {
      threadId: 'thread-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();


    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => {
      Promise.resolve({
        id: 'thread-123'
      });

    });
    mockReplyCommentRepository.checkReplyComment = jest.fn().mockResolvedValue({
      id: 'reply-123',
      referenceCommentId: 'comment-124',
      replyCommentId: 'comment-123',
    });
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockResolvedValue({
      id: 'comment-124',
      content: 'This is a comment',
      owner: 'user-123',
      isDelete: true,
    });


    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockResolvedValue();

    const deleteReplyCommentThreadUseCase = new DeleteReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action & Assert
    await expect(
      deleteReplyCommentThreadUseCase.execute(useCasePayload)
    ).rejects.toThrow('DELETE_REPLY_COMMENT_THREAD.REFERENCE_COMMENT_NOT_FOUND_OR_ALREADY_DELETED');

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyCommentRepository.checkReplyComment).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith('comment-124');
    expect(mockThreadCommentRepository.deleteCommentThread).not.toBeCalled();

  });
});
