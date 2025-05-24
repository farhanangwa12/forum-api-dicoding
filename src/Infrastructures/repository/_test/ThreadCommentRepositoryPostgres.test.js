const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const CreatedCommentThread = require('../../../Domains/thread_comment/entities/CreatedCommentThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ThreadCommentPostgres', () => {
  afterEach(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });


  describe('addCommentThread', () => {
    it('should persist comment from user correcly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ body: 'this is a test thread' });


      const fakeIdGenerator = () => '123';
      const threadCommentPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);
      await threadCommentPostgres.addCommentThread({ content: 'this is a content', owner: 'user-123', threadId: 'thread-123' });

      // Action & assert
      const threadComment = await ThreadCommentTableTestHelper.findThreadCommentById('comment-123');
      expect(threadComment).toBeDefined();

    });

    it('should createdCommentThread object', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ body: 'this is a test thread' });


      const fakeIdGenerator = () => '123';
      const threadCommentPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);
      const threadComment = await threadCommentPostgres.addCommentThread({ content: 'this is a content', owner: 'user-123', threadId: 'thread-123' });

      // Action & assert
      expect(threadComment).toStrictEqual(new CreatedCommentThread({
        id: 'comment-123',
        content: 'this is a content',
        owner: 'user-123'
      }));
    });


  });


  describe('deleteCommentThread', () => {


    it('should successfully mark comment as deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ body: 'this is a test thread' });
      await ThreadCommentTableTestHelper.addThreadComment({ content: 'this is a test comment' });

      // action

      const threadComment = new ThreadCommentRepositoryPostgres(pool, {});
      await threadComment.deleteCommentThread('comment-123');

      // assert
      const threadCommentAfterUpdated = await ThreadCommentTableTestHelper.findThreadCommentById('comment-123');
      expect(threadCommentAfterUpdated.is_delete).toBe(true);


    });
  });


  describe('checkThreadComment', () => {

    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, () => '123');
      // Action & Assert
      await expect(threadCommentRepository.checkThreadComment('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
      await expect(threadCommentRepository.checkThreadComment('comment-123'))
        .rejects
        .toThrowError('Komentar tidak ditemukan');
    });
    it('should return comment data when comment exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
      await ThreadCommentTableTestHelper.addThreadComment({
        id: 'comment-123',
        content: 'this is a test comment',
        owner: 'user-123',
        thread_id: 'thread-123',
      });

      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comment = await threadCommentRepository.checkThreadComment('comment-123');

      // Assert
      expect(comment).toBeDefined();


      expect(comment.id).toBe('comment-123');
      expect(comment.content).toBe('this is a test comment');
      expect(comment.owner).toBe('user-123');
      expect(comment.is_delete).toBe(false);
    });


  });




  describe('getAllCommentByThreadId', () => {
    it('should return all comments for a thread with correct data', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ body: 'this is a test thread', owner: 'user-123' });
      await ThreadCommentTableTestHelper.addThreadComment({
        id: 'comment-123',
        content: 'this is a test comment',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 0,
      });
      await ThreadCommentTableTestHelper.addThreadComment({
        id: 'comment-124',
        content: 'this is a deleted comment',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 1,
      });

      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, {});
      // Action
      const comments = await threadCommentRepository.getAllCommentByThreadId('thread-123');
      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0]).toEqual({
        id: 'comment-123',
        date: expect.any(Date),
        is_delete: false,
        username: 'dicoding',
        content: 'this is a test comment',
      });

      expect(comments[1]).toEqual({
        id: 'comment-124',
        date: expect.any(Date),
        is_delete: true,
        username: 'dicoding',
        content: 'this is a deleted comment',
      });
    });

    it('should return empty array when no comments exist for the thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', body: 'this is a test thread', owner: 'user-123' });
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comments = await threadCommentRepository.getAllCommentByThreadId('thread-123');

      // Assert
      expect(comments).toEqual([]);
    });
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
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, () => '123');

      // Action
      const result = await threadCommentRepository.addReplyCommentThread(comment);

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
      await ThreadCommentTableTestHelper.addReplyCommentThread({
        id: 'reply-123',
        reference_comment_id: 'comment-124',
        reply_comment_id: 'comment-123',
      });
      await ThreadCommentTableTestHelper.addReplyCommentThread({
        id: 'reply-124',
        reference_comment_id: 'comment-125',
        reply_comment_id: 'comment-123',
      });
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const replies = await threadCommentRepository.getAllReplyByCommentId('comment-123');

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
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const replies = await threadCommentRepository.getAllReplyByCommentId('comment-123');

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
      await ThreadCommentTableTestHelper.addReplyCommentThread({
        id: 'reply-123',
        reference_comment_id: 'comment-123',
        reply_comment_id: 'comment-124',
      });
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, () => '123');

      // Action
      const reply = await threadCommentRepository.checkReplyComment('reply-123');

      // Assert
      expect(reply).toBeDefined();
      expect(reply.id).toBe('reply-123');
      expect(reply.reference_comment_id).toBe('comment-123');
      expect(reply.reply_comment_id).toBe('comment-124');
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, () => '123');

      // Action & Assert
      await expect(threadCommentRepository.checkReplyComment('reply-nonexistent'))
        .rejects
        .toThrowError(NotFoundError);
      await expect(threadCommentRepository.checkReplyComment('reply-nonexistent'))
        .rejects
        .toThrowError('Balasan tidak ditemukan');
    });
  });

});