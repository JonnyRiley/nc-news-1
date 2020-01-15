exports.up = function(knex) {
  //console.log("in the UP function");
  return knex.schema.createTable("topics", function(topics_table) {
    topics_table
      .string("slug")
      .primary()
      .unique();
    topics_table.string("description");
  });
};

exports.down = function(knex) {
  //console.log("in the down function");
  return knex.schema.dropTable("topics");
};
