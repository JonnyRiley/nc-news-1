exports.up = function(knex) {
  return knex.schema.createTable("users", function(user_table) {
    user_table
      .string("username")
      .primary()
      .unique();
    user_table.string("avatar_url");
    user_table.string("name");
  });
};
exports.down = function(knex) {
  // console.log("in the down");
  return knex.schema.dropTable("users");
};
