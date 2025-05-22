const AuthorizationError = require('../../../Commons/exceptions/AuthenticationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');

describe('DeleteCommentThreadUseCase', () => {


  it('should orchestrate the delete comment thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };



    // Mock repositories
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();


    // Mock implementations
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'comment-123',
        owner: 'user-123',
        is_delete: false,
      })
    );
    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => Promise.resolve());

    // Instantiate use case
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });
    // Action
    await deleteCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentRepository.deleteCommentThread).toHaveBeenCalledWith(useCasePayload.commentId);
  });


  it('should throw NotFoundError when thread or comment does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-999',
      commentId: 'comment-999',
      userId: 'user-123',
    };



    // Mock repositories
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    // Mock thread not found
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() =>
      Promise.reject(new NotFoundError('Thread tidak ditemukan'))
    );
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() =>
      Promise.reject(new NotFoundError('Komentar tidak ditemukan'))
    );
    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => Promise.resolve());

    // Instantiate use case
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });
    // Action & Assert
    await expect(deleteCommentThreadUseCase.execute(useCasePayload)).rejects.toThrow('Thread tidak ditemukan');
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).not.toHaveBeenCalled();
    expect(mockThreadCommentRepository.deleteCommentThread).not.toHaveBeenCalled();

    // Mock comment not found (after thread exists)
    mockThreadRepository.checkThread.mockImplementation(() => Promise.resolve());
    await expect(deleteCommentThreadUseCase.execute(useCasePayload)).rejects.toThrow('Komentar tidak ditemukan');
    expect(mockThreadCommentRepository.checkThreadComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentRepository.deleteCommentThread).not.toHaveBeenCalled();
  });

  it('should throw AuthorizationError when user is not the comment owner', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-456', // Bukan pemilik
    };
    // Mock repositories
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();


    // Mock implementations
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'comment-123',
        owner: 'user-123',
        is_delete: false,
      })
    );
    mockThreadCommentRepository.deleteCommentThread = jest.fn().mockImplementation(() => Promise.resolve());
    // Instantiate use case
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });
    // Action & Assert
    await expect(deleteCommentThreadUseCase.execute(useCasePayload)).rejects.toThrow('Anda tidak berhak terhadap resource ini');
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentRepository.deleteCommentThread).not.toHaveBeenCalled();
  });


});