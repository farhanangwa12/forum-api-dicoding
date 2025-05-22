const CreateCommentThread = require('../CreateCommentThread');

describe('CreateCommentThread', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-456'
    };

    // Action & Assert
    expect(() => new CreateCommentThread(payload)).toThrowError('CREATE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      threadId: 'thread-456'
    };

    // Action & Assert
    expect(() => new CreateCommentThread(payload)).toThrowError('CREATE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a comment thread successfully with valid payload', () => {
    // Arrange
    const payload = {
      content: 'This is a comment',
      owner: 'user-123',
      threadId: 'thread-456'
    };

    // Act
    const commentThread = new CreateCommentThread(payload);

    // Assert
    expect(commentThread.content).toEqual(payload.content);
    expect(commentThread.owner).toEqual(payload.owner);
    expect(commentThread.threadId).toEqual(payload.threadId);
  });
});