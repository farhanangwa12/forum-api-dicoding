const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyCommentTableTestHelper = require('../../../../tests/ReplyCommentTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ReplyCommentRepositoryPostgres = require('../ReplyCommentRepositoryPostgres');

describe('ReplyCommentRepositoryPostgres', () => {
    afterEach(async () => {
        await ReplyCommentTableTestHelper.cleanTable();
        await ThreadCommentTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });



    describe('addReplyCommentThread', () => {
        it('should persist reply comment and return correct id', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-123',
                content: 'this is a test comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-124',
                content: 'this is a reply comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            const comment = {
                referenceCommentId: 'comment-123',
                replyCommentId: 'comment-124',
            };

            const replyCommentRepository = new ReplyCommentRepositoryPostgres(pool, () => 123);

            // Action
            const result = await replyCommentRepository.addReplyCommentThread(comment);

            // Assert
            expect(result).toBeDefined();
            expect(result.id).toBe('reply-123');
            const savedReply = await ThreadCommentTableTestHelper.checkReplyComment('reply-123');
            expect(savedReply).toBeDefined();
            expect(savedReply.id).toBe('reply-123');
            expect(savedReply.reference_comment_id).toBe('comment-123');
            expect(savedReply.reply_comment_id).toBe('comment-124');
        });
    });

    describe('getAllReplyByCommentId', () => {
        it('should return all replies for a comment with correct content handling', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-123',
                content: 'this is a test comment',
                owner: 'user-123',
                thread_id: 'thread-123',
                is_delete: 0,
                created_at: new Date('2025-05-21T12:00:00Z'),
            });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-124',
                content: 'this is a reply comment',
                owner: 'user-123',
                thread_id: 'thread-123',
                is_delete: 0,
                created_at: new Date('2025-05-21T12:01:00Z'),
            });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-125',
                content: 'this is a deleted reply comment',
                owner: 'user-123',
                thread_id: 'thread-123',
                is_delete: 1,
                created_at: new Date('2025-05-21T12:02:00Z'),
            });
            await ReplyCommentTableTestHelper.addReplyCommentThread({
                id: 'reply-123',
                reference_comment_id: 'comment-124',
                reply_comment_id: 'comment-123',
            });
            await ReplyCommentTableTestHelper.addReplyCommentThread({
                id: 'reply-124',
                reference_comment_id: 'comment-125',
                reply_comment_id: 'comment-123',
            });

            const replyCommentRepository = new ReplyCommentRepositoryPostgres(pool, () => 123);

            // Action
            const replies = await replyCommentRepository.getAllReplyByCommentId('comment-123');

            // Assert
            expect(replies).toHaveLength(2);
            expect(replies[0]).toEqual({
                id: 'reply-123',
                username: 'dicoding',
                date: expect.any(Date),
                is_delete: false,
                content: 'this is a reply comment',
            });
            expect(replies[1]).toEqual({
                id: 'reply-124',
                username: 'dicoding',
                date: expect.any(Date),
                is_delete: true,
                content: 'this is a deleted reply comment',
            });
        });

        it('should return empty array when no replies exist for the comment', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-123',
                content: 'this is a test comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            const replyCommentRepository = new ReplyCommentRepositoryPostgres(pool, {});

            // Action
            const replies = await replyCommentRepository.getAllReplyByCommentId('comment-123');

            // Assert
            expect(replies).toEqual([]);
        });
    });

    describe('checkReplyComment', () => {
        it('should return reply comment data when reply exists', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-123',
                content: 'this is a test comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            await ThreadCommentTableTestHelper.addThreadComment({
                id: 'comment-124',
                content: 'this is a reply comment',
                owner: 'user-123',
                thread_id: 'thread-123',
            });
            await ReplyCommentTableTestHelper.addReplyCommentThread({
                id: 'reply-123',
                reference_comment_id: 'comment-123',
                reply_comment_id: 'comment-124',
            });

            const replyCommentRepository = new ReplyCommentRepositoryPostgres(pool, () => 123);
            // Action
            const reply = await replyCommentRepository.checkReplyComment('reply-123');

            // Assert
            expect(reply).toBeDefined();
            expect(reply.id).toBe('reply-123');
            expect(reply.reference_comment_id).toBe('comment-123');
            expect(reply.reply_comment_id).toBe('comment-124');
        });

        it('should throw NotFoundError when reply does not exist', async () => {
            // Arrange
            const replyCommentRepository = new ReplyCommentRepositoryPostgres(pool, () => '123');

            // Action & Assert
            await expect(replyCommentRepository.checkReplyComment('reply-nonexistent'))
                .rejects
                .toThrowError(NotFoundError);
            await expect(replyCommentRepository.checkReplyComment('reply-nonexistent'))
                .rejects
                .toThrowError('Balasan tidak ditemukan');
        });
    });
})