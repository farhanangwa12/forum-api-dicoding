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
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, () => 123);
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
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, () => 123);
      // Action
      const comments = await threadCommentRepository.getAllCommentByThreadId('thread-123');

      // Assert
      expect(comments).toEqual([]);
    });
  });





  

});