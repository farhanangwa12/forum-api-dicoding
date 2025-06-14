/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const ThreadRepository = require('../Domains/thread/ThreadRepository');
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres');
const ThreadCommentRepository = require('../Domains/thread_comment/ThreadCommentRepository');
const ThreadCommentRepositoryPostgres = require('../Infrastructures/repository/ThreadCommentRepositoryPostgres');
const ReplyCommentRepository = require('../Domains/reply_comment/ReplyCommentRepository');
const ReplyCommentRepositoryPostgres = require('./repository/ReplyCommentRepositoryPostgres');
const LikeCommentRepository = require('../Domains/like_comment/LikeCommentRepository');
const LikeCommentRepositoryPostgres = require('../Infrastructures/repository/LikeCommentRepositoryPostgres');
// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const AddCommentThreadUseCase = require('../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../Applications/use_case/DeleteCommentThreadUseCase');
const GetDetailThreadUseCase = require('../Applications/use_case/GetDetailThreadUseCase');
const AddReplyCommentThreadUseCase = require('../Applications/use_case/AddReplyCommentThreadUseCase');
const DeleteReplyCommentThreadUseCase = require('../Applications/use_case/DeleteReplyCommentThreadUseCase');
const DoLikeAndUnlikeCommentThreadUseCase = require('../Applications/use_case/DoLikeAndUnlikeCommentThreadUseCase');
const { name } = require('../Interfaces/http/api/users');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid
        }
      ]
    }

  },
  {
    key: ThreadCommentRepository.name,
    Class: ThreadCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ReplyCommentRepository.name,
    Class: ReplyCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,

        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: LikeCommentRepository.name,
    Class: LikeCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  }
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },

  {
    key: AddCommentThreadUseCase.name,
    Class: AddCommentThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }

      ]
    }
  },
  {
    key: DeleteCommentThreadUseCase.name,
    Class: DeleteCommentThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }

      ]
    }
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'replyCommentRepository',
          internal: ReplyCommentRepository.name
        },
        {
          name: 'likeCommentRepository',
          internal: LikeCommentRepository.name
        }
      ]
    }
  },
  {
    key: AddReplyCommentThreadUseCase.name,
    Class: AddReplyCommentThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'replyCommentRepository',
          internal: ReplyCommentRepository.name
        }
      ]
    }
  },
  {
    key: DeleteReplyCommentThreadUseCase.name,
    Class: DeleteReplyCommentThreadUseCase,

    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'replyCommentRepository',
          internal: ReplyCommentRepository.name
        }
      ]
    }
  },
  {
    key: DoLikeAndUnlikeCommentThreadUseCase.name,
    Class: DoLikeAndUnlikeCommentThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'likeCommentRepository',
          internal: LikeCommentRepository.name
        }
      ]
    }

  }
]);

module.exports = container;
