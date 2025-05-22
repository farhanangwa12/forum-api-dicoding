class GetDetailThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(threadId) {
    // Check if thread exists
    await this._threadRepository.checkThread(threadId);
    const thread = await this._threadRepository.detailThread(threadId);
    // Fetch all comments for the thread
    const allComments = await this._threadCommentRepository.getAllCommentByThreadId(threadId);

    const commentWithReply = await Promise.all(
      allComments.map(async (comments) => {
        const replies = await this._threadCommentRepository.getAllReplyByCommentId(comments.id);

        return {
          ...comments, replies: replies
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