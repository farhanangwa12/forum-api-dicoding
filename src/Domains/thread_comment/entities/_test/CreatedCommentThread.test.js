const CreatedCommentThread = require('../CreatedCommentThread');

describe('CreatedCommentThread', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a comment'
      // owner is missing
    };

    // Action & Assert
    expect(() => new CreatedCommentThread(payload)).toThrowError('CREATED_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'This is a comment',
      owner: 'user-123'
    };

    // Action & Assert
    expect(() => new CreatedCommentThread(payload)).toThrowError('CREATED_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedCommentThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a comment',
      owner: 'user-123'
    };

    // Action
    const createdCommentThread = new CreatedCommentThread(payload);

    // Assert
    expect(createdCommentThread.id).toEqual(payload.id);
    expect(createdCommentThread.content).toEqual(payload.content);
    expect(createdCommentThread.owner).toEqual(payload.owner);
  });
});