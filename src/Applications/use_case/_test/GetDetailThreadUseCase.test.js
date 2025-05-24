const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comment/ThreadCommentRepository');

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

    mockThreadRepository.checkThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123'
    }));
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
        },
        {
          id: 'comment-124',
          username: 'user456',
          date: '2023-10-01T12:01:00.000Z',
          content: '**komentar telah dihapus**',
        },
      ])
    );

    mockThreadCommentRepository.getAllReplyByCommentId = jest.fn().mockImplementation((commentId) =>
      Promise.resolve(
        commentId === 'comment-123'
          ? [
            {
              id: 'reply-123',
              username: 'user789',
              date: '2023-10-01T12:03:00.000Z',
              content: 'This is a reply',
            },
          ]
          : []
      )
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockThreadCommentRepository.getAllReplyByCommentId).toHaveBeenCalledWith('comment-124');
    expect(result).toStrictEqual(expectedResult);
  });
});