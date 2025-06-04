const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ReplyCommentTableTestHelper = require('../../../../tests/ReplyCommentTableTestHelper');


const container = require('../../container');
const createServer = require('../createServer');

describe('Reply Comment Section', () => {

    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ReplyCommentTableTestHelper.cleanTable();
        await ThreadCommentTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });
    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted reply with valid payload and authentication', async () => {
            // Arrange
            const requestPayload = {
                content: 'This is a reply from that comment'
            };
            const server = await createServer(container);

            // Add user, thread, comment, and get access token
            const user = await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
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
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'This is a test comment'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const commentId = JSON.parse(comment.payload).data.addedComment.id;


            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
            expect(responseJson.data.addedReply.id).toBeDefined();
            expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
            expect(responseJson.data.addedReply.owner).toEqual(userId);
        });

        it('should response 400 when request payload missing required properties', async () => {
            // Arrange
            const requestPayload = {};
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
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'this is a content'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentId = JSON.parse(comment.payload).data.addedComment.id;
            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {},
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

        it('should response 404 when comment does not exist', async () => {
            // Arrange
            const requestPayload = {
                content: 'This is a reply',
            };
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

            const commentId = 'comment-992';

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
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

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 and delete reply with valid authentication and ownership', async () => {
            // Arrange
            const server = await createServer(container);

            // Add user, thread, comment, reply, and get access token
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
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'this is a comment'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const commentId = JSON.parse(comment.payload).data.addedComment.id;

            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {
                    content: 'this is reply'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const replyId = JSON.parse(reply.payload).data.addedReply.id;


            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 403 when user is not the reply owner', async () => {
            // Arrange
            const server = await createServer(container);

            // Add user1 and get access token for user1
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'user1',
                    password: 'secret',
                    fullname: 'User 1',
                },
            });
            const authResponseUser1 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'user1',
                    password: 'secret',
                },
            });
            const { accessToken: user1AccessToken } = JSON.parse(authResponseUser1.payload).data;

            // Add user2 (to simulate non-owner)
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'user2',
                    password: 'secret',
                    fullname: 'User 2',
                },
            });
            const authResponseUser2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'user2',
                    password: 'secret',
                },
            });
            const { accessToken: user2AccessToken } = JSON.parse(authResponseUser2.payload).data;

            // Add thread using user1
            const threadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'A Thread Title',
                    body: 'This is a thread body',
                },
                headers: {
                    Authorization: `Bearer ${user1AccessToken}`,
                },
            });
            const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

            // Add comment using user1
            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'This is a test comment',
                },
                headers: {
                    Authorization: `Bearer ${user1AccessToken}`,
                },
            });
            const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;

            // Add reply using user1
            const requestPayload = {
                content: 'This is a test reply',
            };
            const replyResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${user1AccessToken}`,
                },
            });
            const replyId = JSON.parse(replyResponse.payload).data.addedReply.id;

            // Action: Attempt to delete the reply using user2's access token
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${user2AccessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Anda tidak berhak menghapus balasan ini');
        });



        it('should response 404 when reply does not exist', async () => {
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
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'This is a test comment'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const commentId = JSON.parse(comment.payload).data.addedComment.id;




            const replyId = 'reply-920';
            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Balasan tidak ditemukan');
        });
    });
})