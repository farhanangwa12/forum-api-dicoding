/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {

  pgm.createTable('likes_comment', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade',

    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread_comments(id)',
      onDelete: 'cascade',
    },
    createdAt: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP'),
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {

  pgm.dropTable('likes_comment');
};
