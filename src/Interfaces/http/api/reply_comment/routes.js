const routes = (handler) => [
 
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.addReplyCommentHandler,
    options: {
      auth: 'forum_api_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyCommentHandler,
    options: {
      auth: 'forum_api_jwt'
    }
  },
];

module.exports = routes;