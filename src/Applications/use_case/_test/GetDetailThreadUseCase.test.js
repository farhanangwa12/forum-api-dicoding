const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const ReplyCommentRepository = require('../../../Domains/reply_comment/ReplyCommentRepository');
const DetailThread = require('../../../Domains/thread/entities/DetailThread');
const DetailThreadComment = require('../../../Domains/thread_comment/entities/DetailThreadComment');
const DetailReplyComment = require('../../../Domains/reply_comment/entities/DetailReplyComment');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding'
    };

    const expectedComment = new DetailThreadComment({
      id: 'comment-123',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_delete: false
    });

    const expectedReply = new DetailReplyComment({
      id: 'reply-123',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply',
      is_delete: false
    });

    const expectedResult = {
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          replies: [
            expectedReply

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
      Promise.resolve(new DetailThread({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'This is a thread title',
        date: '2023-10-01T12:00:00.000Z',
        username: 'dicoding',
      }))
    );
    mockThreadCommentRepository.getAllCommentByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is a comment',
          is_delete: false,
        }
      ])
    );
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation(() =>
      Promise.resolve([{
        id: 'reply-123',
        username: 'user789',
        date: '2023-10-01T12:03:00.000Z',
        content: 'This is a reply',
        is_delete: false,
      }
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
    expect(result).toStrictEqual(expectedResult);
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');

  });


  // Test Case 2: Komentar yang dihapus
  it('should handle deleted comments correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding'
    };

    const expectedComment = new DetailThreadComment({
      id: 'comment-123',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_delete: false,
    });

    const expectedDeletedComment = new DetailThreadComment({
      id: 'comment-124',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'this comment is deleted',
      is_delete: true,
    });

    const expectedReply = new DetailReplyComment({
      id: 'reply-123',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply',
      is_delete: false,
    });

    const expectedReply2 = new DetailReplyComment({
      id: 'reply-124',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply from deleted comment',
      is_delete: false,
    });


    const expectedResult = {
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          replies: [
            expectedReply
          ],
        },
        {
          ...expectedDeletedComment,
          replies: [
            expectedReply2
          ]
        }
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() =>
      Promise.resolve({ id: 'thread-123' })
    );
    mockThreadRepository.detailThread = jest.fn().mockImplementation(() =>
      Promise.resolve(new DetailThread({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'This is a thread title',
        date: '2023-10-01T12:00:00.000Z',
        username: 'dicoding',
      }))
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
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'this comment is deleted',
          is_delete: true,
        }
      ])
    );
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') {
        return Promise.resolve([
          {
            id: 'reply-123',
            username: 'user789',
            date: '2023-10-01T12:03:00.000Z',
            content: 'This is a reply',
            is_delete: false,
          }
        ]);
      }
      if (commentId === 'comment-124') {
        return Promise.resolve([
          {
            id: 'reply-124',
            username: 'user789',
            date: '2023-10-01T12:03:00.000Z',
            content: 'This is a reply from deleted comment',
            is_delete: false,
          }
        ]);
      }
    }
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
    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding'
    });

    const expectedComment = new DetailThreadComment({
      id: 'comment-123',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_delete: false
    });

    const expectedComment2 = new DetailThreadComment({
      id: 'comment-124',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is comment no 2',
      is_delete: false
    });

    const expectedReply = new DetailReplyComment({
      id: 'reply-123',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply',
      is_delete: false
    });

    const expectedDeletedReply = new DetailReplyComment({
      id: 'reply-124',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This reply is deleted',
      is_delete: true
    });


    const expectedResult = {
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          replies: [

            expectedReply
          ],
        },
        {
          ...expectedComment2,
          replies: [
            expectedDeletedReply
          ]
        }
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() =>
      Promise.resolve({ id: 'thread-123' })
    );
    mockThreadRepository.detailThread = jest.fn().mockImplementation(() =>
      Promise.resolve(new DetailThread({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'This is a thread title',
        date: '2023-10-01T12:00:00.000Z',
        username: 'dicoding',
      }))
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
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is comment no 2',
          is_delete: false,
        }
      ])
    );
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') {
        return Promise.resolve([
          {
            id: 'reply-123',
            username: 'user789',
            date: '2023-10-01T12:03:00.000Z',
            content: 'This is a reply',
            is_delete: false,
          }
        ]);
      }
      if (commentId === 'comment-124') {
        return Promise.resolve([
          {
            id: 'reply-124',
            username: 'user789',
            date: '2023-10-01T12:03:00.000Z',
            content: 'This reply is deleted',
            is_delete: true,
          }
        ]);
      }
    }
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
});