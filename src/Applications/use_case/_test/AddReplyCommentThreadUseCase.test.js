const AddReplyCommentThreadUseCase = require('../AddReplyCommentThreadUseCase');
const CreateCommentThread = require('../../../Domains/thread_comment/entities/CreateCommentThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const CreatedCommentThread = require('../../../Domains/thread_comment/entities/CreatedCommentThread');
const ReplyCommentRepository = require('../../../Domains/reply_comment/ReplyCommentRepository');


describe('AddReplyCommentThreadUseCase', () => {

  it('should orchestrating the add reply comment correctly', async () => {

    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'this is reply for comment',
      owner: 'user-123'

    };


    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();
    const createdCommentThread = new CreateCommentThread(useCasePayload);
    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123'
    }));
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'comment-123',
      content: 'this is a coment',
      owner: 'user-123',
      is_delete: false

    }));
    mockThreadCommentRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve(new CreatedCommentThread({
      id: 'comment-124',
      content: 'this is reply for comment',
      owner: 'user-123'

    })));
    mockReplyCommentRepository.addReplyCommentThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'reply-123',
    }));


    const addReplyCommentThreadUseCase = new AddReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action
    const result = await addReplyCommentThreadUseCase.execute(useCasePayload);

    // Assert

    expect(result).toStrictEqual({
      id: 'reply-123', // ID dari replyComment
      content: 'this is reply for comment',
      owner: 'user-123',
    });
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentRepository.addCommentThread).toBeCalledWith(createdCommentThread);
    expect(mockReplyCommentRepository.addReplyCommentThread).toBeCalledWith({
      replyCommentId: useCasePayload.commentId,
      referenceCommentId: 'comment-124', // ID dari addedComment
    });




  });

  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-not-found',
      commentId: 'comment-123',
      content: 'this is reply for comment',
      owner: 'user-123'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.reject(new Error('Thread tidak ditemukan')));
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'comment-123',
      content: 'this is a coment',
      owner: 'user-123',
      is_delete: false

    }));
    mockThreadCommentRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve(new CreatedCommentThread({
      id: 'comment-124',
      content: 'this is reply for comment',
      owner: 'user-123'

    })));
    mockReplyCommentRepository.addReplyCommentThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'reply-123',
    }));
    const addReplyCommentThreadUseCase = new AddReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action & Assert
    await expect(addReplyCommentThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError(new Error('Thread tidak ditemukan'));

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).not.toHaveBeenCalled();
    expect(mockThreadCommentRepository.addCommentThread).not.toHaveBeenCalled();
    expect(mockReplyCommentRepository.addReplyCommentThread).not.toHaveBeenCalled();
  });
  it('should throw NotFoundError when comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-not-found',
      content: 'this is reply for comment',
      owner: 'user-123'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve({ id: 'thread-123' }));
    mockThreadCommentRepository.checkThreadComment = jest.fn().mockImplementation(() => Promise.reject(Error('Komentar tidak ditemukan')));
    mockThreadCommentRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve(new CreatedCommentThread({
      id: 'comment-124',
      content: 'this is reply for comment',
      owner: 'user-123'

    })));
    mockReplyCommentRepository.addReplyCommentThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'reply-123',
    }));

    const addReplyCommentThreadUseCase = new AddReplyCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action & Assert
    await expect(addReplyCommentThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError(new Error('Komentar tidak ditemukan'));

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.checkThreadComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentRepository.addCommentThread).not.toHaveBeenCalled();
    expect(mockReplyCommentRepository.addReplyCommentThread).not.toHaveBeenCalled();
  });

});
