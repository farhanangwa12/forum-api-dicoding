class DetailThread {
    constructor(payload) {
        const { id, title, body, date, username } = payload;
        this._validatePayload(payload)

        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.username = username;

    }

    _validatePayload({ id, title, body, date, username }) {
        // Cek apakah semua properti ada
        if (!id || !title || !body || !date || !username) {
            throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        // Cek apakah semuanya string
        if (
            typeof id !== 'string' ||
            typeof title !== 'string' ||
            typeof body !== 'string' ||
            typeof username !== 'string'
        ) {
            throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }

        const isValidDate = !isNaN(Date.parse(date));
        if (!isValidDate) {
            throw new Error('DETAIL_THREAD.INVALID_DATE_FORMAT');
        }
    }

}


module.exports = DetailThread;