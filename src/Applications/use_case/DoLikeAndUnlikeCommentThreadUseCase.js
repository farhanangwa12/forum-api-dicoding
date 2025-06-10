class DoLikeAndUnlikeCommentThreadUseCase {
    constructor({ threadRepository, threadCommentRepository, likeCommentRepository }) {
        this.threadRepository = threadRepository;
        this.threadCommentRepository = threadCommentRepository;
        this.likeCommentRepository = likeCommentRepository;

    }

    async execute(useCasePayload) {
        await this.threadRepository.checkThread(useCasePayload.threadId);
        await this.threadCommentRepository.checkThreadComment(useCasePayload.commentId);
        const likeIsExist = await this.likeCommentRepository.checkLikeComment(useCasePayload.owner, useCasePayload.commentId);
        if (!likeIsExist) {
            this.likeCommentRepository.likeComment(useCasePayload.owner, useCasePayload.commentId);
        } else {
            this.likeCommentRepository.unlikeComment(useCasePayload.owner, useCasePayload.commentId);

        }



    }
}

module.exports = DoLikeAndUnlikeCommentThreadUseCase;