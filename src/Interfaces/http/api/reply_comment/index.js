
const ReplyCommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'reply_Comment',
  register: async (server, { container }) => {
    const replyCommentHandler = new ReplyCommentHandler(container);
    server.route(routes(replyCommentHandler));
  }
};