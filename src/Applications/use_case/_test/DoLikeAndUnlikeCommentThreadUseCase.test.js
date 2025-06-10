const DoLikeAndUnlikeCommentThreadUseCase = require('../DoLikeAndUnlikeCommentThreadUseCase');
const LikeCommentRepository = require('../../../Domains/like_comment/LikeCommentRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
describe('LikeAndUnlikeCommentThreadUseCase', () => {
  it('should orchestrate the like comment action correctly', async () => {

    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    // Mock implementations
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123'
    }));
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
        isDelete: false,
      })
    );
    mockLikeCommentRepository.checkLikeComment = jest.fn().mockImplementation(() => {
      Promise.resolve({
        id: 'like-123'
      });
    });
    mockLikeCommentRepository.likeComment = jest.fn().mockImplementation(() => { Promise.resolve(); });
    mockLikeCommentRepository.unlikeComment = jest.fn().mockImplementation(() => { Promise.resolve(); });



    const doLikeAndUnlikeCommentThreadUseCase = new DoLikeAndUnlikeCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,

    });

    // Action

    await doLikeAndUnlikeCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.checkLikeComment).toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeCommentRepository.likeComment).toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeCommentRepository.unlikeComment).not.toHaveBeenCalled();


  });

  it('should orchestrate the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.checkThread = jest.fn(() =>
      Promise.resolve({ id: 'thread-123' })
    );

    mockThreadCommentRepository.checkThreadComment = jest.fn(() =>
      Promise.resolve({
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
        isDelete: false,
      })
    );

    mockLikeCommentRepository.checkLikeComment = jest.fn(() =>
      Promise.resolve({
        id: 'like-123'
      })
    );

    mockLikeCommentRepository.likeComment = jest.fn(() =>
      Promise.resolve()
    );

    mockLikeCommentRepository.unlikeComment = jest.fn(() =>
      Promise.resolve()
    );

    const useCase = new DoLikeAndUnlikeCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Act
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith('thread-123');
    expect(mockThreadCommentRepository.checkThreadComment).toHaveBeenCalledWith('comment-123');
    expect(mockLikeCommentRepository.checkLikeComment).toHaveBeenCalledWith('user-123', 'comment-123');
    expect(mockLikeCommentRepository.likeComment).not.toHaveBeenCalled();
    expect(mockLikeCommentRepository.unlikeComment).toHaveBeenCalledWith('user-123', 'comment-123');
  });


});