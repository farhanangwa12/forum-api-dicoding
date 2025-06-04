const DetailThread = require('../DetailThread');

describe('DetailThread Entity', () => {
  it('should create DetailThread object correctly when given valid payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 'dicoding',
    };

    // Act
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });

  it('should throw error when a required property is missing', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      // username is missing
    };

    // Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when a property is not a string', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: '2023-10-01T12:00:00.000Z',
      username: 123, // not a string
    };

    // Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should throw error when date is not a valid ISO date string', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A Thread title',
      body: 'This is a thread title',
      date: 'invalid-date-string',
      username: 'dicoding',
    };

    // Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_DATE_FORMAT');
  });
});
