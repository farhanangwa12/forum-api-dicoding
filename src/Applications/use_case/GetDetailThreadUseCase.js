const DetailThreadComment = require('../../Domains/thread_comment/entities/DetailThreadComment');
const DetailReplyComment = require('../../Domains/reply_comment/entities/DetailReplyComment');
class GetDetailThreadUseCase {
  constructor({ threadRepository, threadCommentRepository, replyCommentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._replyCommentRepository = replyCommentRepository;
    this._likeCommentRepository = likeCommentRepository;
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
        // Map replies untuk mengubah content berdasarkan isDelete
        const filteredReplies = replies.map((reply) => (new DetailReplyComment(reply)));

        const detailComment = new DetailThreadComment(comments);

        const likeCount = await this._likeCommentRepository.getLikeCountByCommentId(comments.id);
        return {
          ...detailComment,
          likeCount,
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