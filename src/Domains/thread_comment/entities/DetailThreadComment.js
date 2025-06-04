class DetailThreadComment {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, username, date, content, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
  }

  _validatePayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const isValidDate = !isNaN(Date.parse(date));
    if (!isValidDate) {
      throw new Error('DETAIL_THREAD_COMMENT.INVALID_DATE_FORMAT');
    }
  }
}

module.exports = DetailThreadComment;
