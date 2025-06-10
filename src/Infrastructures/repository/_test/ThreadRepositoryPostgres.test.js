
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreatedThread = require('../../../Domains/thread/entities/CreatedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });


  describe('addThread', () => {
    it('should persist thread and return created thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const thread = {
        title: 'Test Thread',
        body: 'This is a test thread',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // Stub
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepository.addThread(thread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threads).toBeDefined();
      expect(threads.id).toBe('thread-123');
      expect(threads.title).toBe('Test Thread');
      expect(threads.body).toBe('This is a test thread');
      expect(threads.owner).toBe('user-123');
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'Test Thread',
        owner: 'user-123',
      }));
    });
  });

  describe('detailThread', () => {
    it('should return thread details correctly when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Test Thread',
        body: 'This is a test thread',
        owner: 'user-123',
        createdAt: new Date('2025-05-21T12:00:00Z'),
      });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetails = await threadRepository.detailThread('thread-123');


      // Assert
      expect(threadDetails).toBeDefined();
      expect(threadDetails.id).toBe('thread-123');
      expect(threadDetails.title).toBe('Test Thread');
      expect(threadDetails.body).toBe('This is a test thread');
      expect(threadDetails.date.getTime()).toBe(new Date('2025-05-21T12:00:00Z').getTime());
      expect(threadDetails.username).toBe('dicoding');
    });


  });

  describe('checkThread', () => {
    it('should return thread id when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Test Thread',
        body: 'This is a test thread',
        owner: 'user-123',
      });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadId = await threadRepository.checkThread('thread-123');

      // Assert
      expect(threadId).toBe('thread-123');
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepository.checkThread('thread-nonexistent'))
        .rejects
        .toThrowError(NotFoundError);
      await expect(threadRepository.checkThread('thread-nonexistent'))
        .rejects
        .toThrowError('Thread tidak ditemukan');
    });
  });

});