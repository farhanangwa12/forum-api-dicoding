class GetDetailThreadUseCase {
  constructor({ threadRepository, threadCommentRepository, replyCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(threadId) {
    // Check if thread exists
    await this._threadRepository.checkThread(threadId);
    const thread = await this._threadRepository.detailThread(threadId);
    // Fetch all comments for the thread
    const allComments = await this._threadCommentRepository.getAllCommentByThreadId(threadId);

    const commentWithReply = await Promise.all(
      allComments.map(async (comments) => {
        const replies = await this._replyCommentRepository.getAllReplyByCommentId(comments.id);
        // Map replies untuk mengubah content berdasarkan is_delete
        const filteredReplies = replies.map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
        }));
        return {
          id: comments.id,
          username: comments.username,
          date: comments.date,
          content: comments.is_delete ? '**komentar telah dihapus**' : comments.content,
          replies: filteredReplies
        };
      })
    );
    // Return thread details with comments
    return {
      ...thread,
      comments: commentWithReply,
    };
  }
}

module.exports = GetDetailThreadUseCase;