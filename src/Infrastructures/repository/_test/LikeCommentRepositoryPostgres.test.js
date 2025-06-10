const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyCommentTableTestHelper = require('../../../../tests/ReplyCommentTableTestHelper');
const LikeCommentTableTestHelper = require('../../../../tests/LikeCommentThreadTableTestHelper');


describe('LikeCommentRepositoryPostgres', () => {
    const userId = 'user-123';
    const commentId = 'comment-123';

    afterEach(async () => {
        await ReplyCommentTableTestHelper.cleanTable();
        await ThreadCommentTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('likeComment function', () => {
        it('should persist like comment and return id', async () => {
            // Arrange

            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-123',
                content: 'this is a test comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, () => 123);

            // Action
            await likeCommentRepository.likeComment(userId, commentId);

            // Assert
            const result = await LikeCommentTableTestHelper.checkLikeCommentByUserAndComment({ userId: userId, commentId: commentId });

            expect(result).toBeDefined();
            expect(result.user_id).toEqual(userId);
            expect(result.comment_id).toEqual(commentId);
        });
    });

    describe('unlikeComment function', () => {
        it('should delete like comment record from database', async () => {
            // Arrange

            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-123',
                content: 'this is a test comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, () => 123);
            await likeCommentRepository.likeComment(userId, commentId);
            await likeCommentRepository.unlikeComment(userId, commentId);
            // Action
            const checkLike = await likeCommentRepository.checkLikeComment(userId, commentId);



            // Assert

            expect(checkLike).toEqual(0);
        });
    });

    describe('checkLikeComment function', () => {
        it('should return 0 if like not found', async () => {
            // Arrange
            const likeCommentRepo = new LikeCommentRepositoryPostgres(pool);

            // Act
            const result = await likeCommentRepo.checkLikeComment(userId, commentId);

            // Assert
            expect(result).toBe(0);
        });

        it('should return like id if like is found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: userId });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: commentId,
                content: 'this is a test comment',
                owner: userId,
                thread_id: 'thread-123',
            });

            const likeCommentRepo = new LikeCommentRepositoryPostgres(pool, () => 999);
            await likeCommentRepo.likeComment(userId, commentId);

            // Act
            const result = await likeCommentRepo.checkLikeComment(userId, commentId);

            // Assert
            expect(result).toEqual('like-999');
        });
    });

    describe('LikeCommentRepositoryPostgres.getLikeCountByCommentId', () => {

        it('should return correct like count for a comment', async () => {
            // Arrange
            const userMainId = 'user-123';
            const user1 = { id: 'user-1', username: 'user1' };
            const user2 = { id: 'user-2', username: 'user2' };
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userMainId, username: 'dicoding' });
            await UsersTableTestHelper.addUser(user1);
            await UsersTableTestHelper.addUser(user2);
            await ThreadTableTestHelper.addThread({ id: threadId, body: 'this is a test thread', owner: userMainId });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: commentId,
                content: 'this is a test comment',
                owner: userMainId,
                thread_id: threadId,
            });

            await LikeCommentTableTestHelper.addLikeComment({
                id: 'like-1',
                user_id: user1.id,
                comment_id: commentId,
            });

            await LikeCommentTableTestHelper.addLikeComment({
                id: 'like-2',
                user_id: user2.id,
                comment_id: commentId,
            });

            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, {});

            // Act
            const count = await likeCommentRepository.getLikeCountByCommentId(commentId);

            // Assert
            expect(count).toEqual(2);
        });

        it('should return 0 if no likes exist for the comment', async () => {
            // Arrange
            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, {});

            // Act
            const count = await likeCommentRepository.getLikeCountByCommentId('non-existent-comment');

            // Assert
            expect(count).toEqual(0);
        });
    });

});
