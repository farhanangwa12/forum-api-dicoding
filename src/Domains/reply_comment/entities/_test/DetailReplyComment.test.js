const DetailReplyComment = require('../DetailReplyComment');

describe('DetailReplyComment Entity', () => {
  it('should create DetailReplyComment correctly when isDelete is false', () => {
    const payload = {
      id: 'reply-123',
      username: 'replier',
      date: '2023-10-01T12:00:00Z',
      content: 'This is a reply',
      isDelete: false,
    };

    const reply = new DetailReplyComment(payload);

    expect(reply.id).toBe(payload.id);
    expect(reply.username).toBe(payload.username);
    expect(reply.date).toBe(payload.date);
    expect(reply.content).toBe(payload.content);
  });

  it('should mask content when isDelete is true', () => {
    const payload = {
      id: 'reply-123',
      username: 'replier',
      date: '2023-10-01T12:00:00Z',
      content: 'Sensitive reply',
      isDelete: true,
    };

    const reply = new DetailReplyComment(payload);

    expect(reply.content).toBe('**balasan telah dihapus**');
  });

  it('should throw error when missing required property', () => {
    const payload = {
      id: 'reply-123',
      username: 'replier',
      // date & content missing
    };

    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are incorrect', () => {
    const payload = {
      id: 123, // should be string
      username: 'replier',
      date: '2023-10-01T12:00:00Z',
      content: 'Reply here',
    };

    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when date format is invalid', () => {
    const payload = {
      id: 'reply-123',
      username: 'replier',
      date: 'invalid-date',
      content: 'Reply',
    };

    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY_COMMENT.INVALID_DATE_FORMAT');
  });
});
