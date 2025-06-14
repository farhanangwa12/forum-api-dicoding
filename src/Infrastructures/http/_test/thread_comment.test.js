const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment with valid payload and authentication', async () => {
      // Arrange

      const requestPayload = {
        content: 'This is a comment',
      };
      const server = await createServer(container);

      // Add user, thread, and get access token
      const user = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const userId = JSON.parse(user.payload).data.addedUser.id;
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;



      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadId = JSON.parse(thread.payload).data.addedThread.id;
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });



      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedComment.owner).toEqual(userId);
    });

    it('should response 400 when request payload missing required properties', async () => {
      // Arrange

      const requestPayload = {};
      const server = await createServer(container);

      // Add user, thread, and get access token
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      });

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = JSON.parse(thread.payload).data.addedThread.id;
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 401 when missing authentication', async () => {
      // Arrange

      const requestPayload = {
        content: 'This is a comment',
      };
      const server = await createServer(container);

      // Add user and thread
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      });

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = JSON.parse(thread.payload).data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(JSON.parse(response.payload).message).toEqual('Missing authentication');
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const threadId = 'thread-999';
      const requestPayload = {
        content: 'This is a comment',
      };
      const server = await createServer(container);

      // Add user and get access token

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment with valid authentication and ownership', async () => {
      // Arrange
      const server = await createServer(container);

      // Add user, thread, comment, and get access token
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;


      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadId = JSON.parse(thread.payload).data.addedThread.id;



      // Add Comment for thread
      await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      const threadComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'this is a test comment'

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });



      const commentId = JSON.parse(threadComment.payload).data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when missing authentication', async () => {
      // Arrange

      const server = await createServer(container);

      // Add user, thread, and comment
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      });


      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadId = JSON.parse(thread.payload).data.addedThread.id;
      const threadComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'this is a thread comment'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      const commentId = JSON.parse(threadComment.payload).data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(JSON.parse(response.payload).message).toEqual('Missing authentication');
    });

    it('should response 403 when user is not the comment owner', async () => {
      // Arrange

      const server = await createServer(container);

      // Add users, thread, comment, and get access token for different user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rudibakwan',
          password: 'secret',
          fullname: 'Rudi Bakwan'
        }
      });



      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'budinmax',
          password: 'secret',
          fullname: 'Budi Nmax'
        }
      });

      const authResponse1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rudibakwan',
          password: 'secret',
        },
      });
      const authResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'budinmax',
          password: 'secret',
        },
      });
      const accessToken1 = JSON.parse(authResponse1.payload).data.accessToken;
      const accessToken2 = JSON.parse(authResponse2.payload).data.accessToken;


      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const threadId = JSON.parse(thread.payload).data.addedThread.id;
      const threadComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'This is a thread comment'
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });


      const commentId = JSON.parse(threadComment.payload).data.addedComment.id;

      // Action
      // Menghapus dengan user 2
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak menghapus resource ini');
    });

    it('should response 404 when comment does not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Add user, thread, and get access token
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'A Thread Title',
          body: 'This is a thread body',

        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = JSON.parse(thread.payload).data.addedThread.id;
      const commentId = 'comment-999';
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
  });


});