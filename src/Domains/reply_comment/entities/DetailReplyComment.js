class DetailReplyComment {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, username, date, content, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**balasan telah dihapus**' : content;
  }

  _validatePayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('DETAIL_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const isValidDate = !isNaN(Date.parse(date));
    if (!isValidDate) {
      throw new Error('DETAIL_REPLY_COMMENT.INVALID_DATE_FORMAT');
    }
  }
}

module.exports = DetailReplyComment;
