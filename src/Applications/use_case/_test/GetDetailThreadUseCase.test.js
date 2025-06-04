const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const ReplyCommentRepository = require('../../../Domains/reply_comment/ReplyCommentRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedResult = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          replies: [
            {
              id: 'reply-123',
              username: 'user789',
              date: '2023-10-01T12:03:00.000Z',
              content: 'This is a reply',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() =>
      Promise.resolve({ id: 'thread-123' })
    );
    mockThreadRepository.detailThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'This is a thread title',
        date: '2023-10-01T12:00:00.000Z',
        username: 'dicoding',
      })
    );
    mockThreadCommentRepository.getAllCommentByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          is_delete: false,
        },
      ])
    );
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          username: 'user789',
          date: '2023-10-01T12:03:00.000Z',
          content: 'This is a reply',
          is_delete: false,
        },
      ])
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(result).toStrictEqual(expectedResult);
  });


  // Test Case 2: Komentar yang dihapus
  it('should handle deleted comments correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedResult = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          replies: [],
        },
        {
          id: 'comment-124',
          username: 'user456',
          date: '2023-10-01T12:01:00.000Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() =>
      Promise.resolve({ id: 'thread-123' })
    );
    mockThreadRepository.detailThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'This is a thread title',
        date: '2023-10-01T12:00:00.000Z',
        username: 'dicoding',
      })
    );
    mockThreadCommentRepository.getAllCommentByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          is_delete: false,
        },
        {
          id: 'comment-124',
          username: 'user456',
          date: '2023-10-01T12:01:00.000Z',
          content: 'This is a deleted comment',
          is_delete: true,
        },
      ])
    );
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation(() =>
      Promise.resolve([])
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-124');
    expect(result).toStrictEqual(expectedResult);
  });

  // Test Case 3: Balasan yang dihapus
  it('should handle deleted replies correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedResult = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          replies: [
            {
              id: 'reply-123',
              username: 'user789',
              date: '2023-10-01T12:03:00.000Z',
              content: 'This is a reply',
            },
            {
              id: 'reply-124',
              username: 'user790',
              date: '2023-10-01T12:04:00.000Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() =>
      Promise.resolve({ id: 'thread-123' })
    );
    mockThreadRepository.detailThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'This is a thread title',
        date: '2023-10-01T12:00:00.000Z',
        username: 'dicoding',
      })
    );
    mockThreadCommentRepository.getAllCommentByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          is_delete: false,
        },
      ])
    );
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          username: 'user789',
          date: '2023-10-01T12:03:00.000Z',
          content: 'This is a reply',
          is_delete: false,
        },
        {
          id: 'reply-124',
          username: 'user790',
          date: '2023-10-01T12:04:00.000Z',
          content: 'This is a deleted reply',
          is_delete: true,
        },
      ])
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(result).toStrictEqual(expectedResult);
  });
});