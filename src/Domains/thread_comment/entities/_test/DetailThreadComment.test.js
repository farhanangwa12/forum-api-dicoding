const DetailThreadComment = require('../DetailThreadComment');

describe('DetailThreadComment entity', () => {
  it('should create DetailThreadComment object correctly when isDelete is false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: '2023-10-01T12:00:00Z',
      content: 'A comment',
      isDelete: false,
    };

    // Act
    const detail = new DetailThreadComment(payload);

    // Assert
    expect(detail.id).toBe(payload.id);
    expect(detail.username).toBe(payload.username);
    expect(detail.date).toBe(payload.date);
    expect(detail.content).toBe(payload.content);
  });

  it('should replace content with "**komentar telah dihapus**" when isDelete is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: '2023-10-01T12:00:00Z',
      content: 'This will be hidden',
      isDelete: true,
    };

    const detail = new DetailThreadComment(payload);

    expect(detail.content).toBe('**komentar telah dihapus**');
  });

  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'comment-123',
      username: 'user123',
      // missing 'date' and 'content'
    };

    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are invalid', () => {
    const payload = {
      id: 123, // should be string
      username: 'user123',
      date: '2023-10-01T12:00:00Z',
      content: 'Test',
    };

    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when date format is invalid', () => {
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: 'not-a-date-format',
      content: 'Test',
    };

    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.INVALID_DATE_FORMAT');
  });
});
