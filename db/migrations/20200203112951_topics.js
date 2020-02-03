exports.up = function(knex) {
  return knex.schema.createTable("topics", function(topics_table) {
    topics_table
      .string("slug")
      .primary()
      .unique();
    topics_table.string("description");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
