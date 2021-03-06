let db = require('./connection');

module.exports = {
  all() {
    return db.any(`
      SELECT id, name, language_id, created
      FROM user_account
    `);
  },
  withIds(userIds) {
    return db.any(`
      SELECT id, name, language_id, created
      FROM user_account
      WHERE user_account.id IN ($1:csv)
    `,
    [ userIds ]);
  }
};
