const LikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'like_comment',
  register: async (server, { container }) => {
    const likeHandler = new LikeHandler(container);
    server.route(routes(likeHandler));
  },
};