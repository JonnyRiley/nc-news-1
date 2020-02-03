exports.up = function(knex) {
  return knex.schema.createTable("users", function(users_tables) {
    users_tables
      .string("username")
      .primary()
      .unique();
    users_tables.string("avatar_url");
    users_tables.string("name");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
