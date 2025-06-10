const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');
const ReplyCommentRepository = require('../../../Domains/reply_comment/ReplyCommentRepository');
const DetailThread = require('../../../Domains/thread/entities/DetailThread');
const DetailThreadComment = require('../../../Domains/thread_comment/entities/DetailThreadComment');
const DetailReplyComment = require('../../../Domains/reply_comment/entities/DetailReplyComment');
const LikeCommentRepository = require('../../../Domains/like_comment/LikeCommentRepository');

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
      isDelete: false
    });

    const expectedReply = new DetailReplyComment({
      id: 'reply-123',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply',
      isDelete: false
    });

    const expectedResult = {
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          likeCount: 5,
          replies: [
            expectedReply

          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();


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
          isDelete: false,
        }
      ])
    );

    mockLikeCommentRepository.getLikeCountByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') return Promise.resolve(5);
      return Promise.resolve(0);
    });

    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation(() =>
      Promise.resolve([{
        id: 'reply-123',
        username: 'user789',
        date: '2023-10-01T12:03:00.000Z',
        content: 'This is a reply',
        isDelete: false,
      }
      ])
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository,
      likeCommentRepository: mockLikeCommentRepository
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(result).toStrictEqual(expectedResult);
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockLikeCommentRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-123');

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
      isDelete: false,
    });

    const expectedDeletedComment = new DetailThreadComment({
      id: 'comment-124',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'this comment is deleted',
      isDelete: true,
    });

    const expectedReply = new DetailReplyComment({
      id: 'reply-123',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply',
      isDelete: false,
    });

    const expectedReply2 = new DetailReplyComment({
      id: 'reply-124',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply from deleted comment',
      isDelete: false,
    });


    const expectedResult = {
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          likeCount: 5,
          replies: [
            expectedReply
          ],
        },
        {
          ...expectedDeletedComment,
          likeCount: 0,
          replies: [
            expectedReply2
          ]
        }
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();


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
          isDelete: false,
        },
        {
          id: 'comment-124',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'this comment is deleted',
          isDelete: true,
        }
      ])
    );

    mockLikeCommentRepository.getLikeCountByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') return Promise.resolve(5);
      if (commentId === 'comment-124') return Promise.resolve(0);
    });
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') {
        return Promise.resolve([
          {
            id: 'reply-123',
            username: 'user789',
            date: '2023-10-01T12:03:00.000Z',
            content: 'This is a reply',
            isDelete: false,
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
            isDelete: false,
          }
        ]);
      }
    }
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository,
      likeCommentRepository: mockLikeCommentRepository
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-124');
    expect(mockLikeCommentRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockLikeCommentRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-124');
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
      isDelete: false
    });

    const expectedComment2 = new DetailThreadComment({
      id: 'comment-124',
      username: 'user123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is comment no 2',
      isDelete: false
    });

    const expectedReply = new DetailReplyComment({
      id: 'reply-123',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This is a reply',
      isDelete: false
    });

    const expectedDeletedReply = new DetailReplyComment({
      id: 'reply-124',
      username: 'user789',
      date: '2023-10-01T12:03:00.000Z',
      content: 'This reply is deleted',
      isDelete: true
    });


    const expectedResult = {
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          likeCount: 3,
          replies: [

            expectedReply
          ],
        },
        {
          ...expectedComment2,
          likeCount: 1,
          replies: [
            expectedDeletedReply
          ]
        }
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();


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
          isDelete: false,
        },
        {
          id: 'comment-124',
          username: 'user123',
          date: '2023-10-01T12:00:00.000Z',
          content: 'This is comment no 2',
          isDelete: false,
        }
      ])
    );


    mockLikeCommentRepository.getLikeCountByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') return Promise.resolve(3);
      if (commentId === 'comment-124') return Promise.resolve(1);
    });
    mockReplyCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-123') {
        return Promise.resolve([
          {
            id: 'reply-123',
            username: 'user789',
            date: '2023-10-01T12:03:00.000Z',
            content: 'This is a reply',
            isDelete: false,
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
            isDelete: true,
          }
        ]);
      }
    }
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyCommentRepository: mockReplyCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-124');
    expect(mockLikeCommentRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockLikeCommentRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-124');
    expect(result).toStrictEqual(expectedResult);
  });
});