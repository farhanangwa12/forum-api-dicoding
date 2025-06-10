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
  pgm.createTable('reply_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    referenceCommentId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread_comments(id)',
      onDelete: 'CASCADE'
    },
    replyCommentId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread_comments(id)',
      onDelete: 'CASCADE'
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('reply_comments', {});
};
