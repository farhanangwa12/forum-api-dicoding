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
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    threadId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread(id)',
      onDelete: 'cascade',

    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade'
    },

    createdAt: {
      type: 'TIMESTAMP', notNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP', notNull: false
    },
    isDelete: {
      type: 'BOOLEAN',
      defaultValue: false
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
