exports.up = function (knex) {
  return knex.schema.createTable("users", function (articles_table) {
    articles_table.increments("user_id").primary();
    articles_table.string("username").notNullable();
    articles_table.text("email").notNullable();
    // articles_table.timestamp("created_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
