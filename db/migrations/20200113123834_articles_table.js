exports.up = function(knex) {
  console.log("in the UP function");
  return knex.schema.createTable("articles", function(articles_table) {
    articles_table.increments("article_id").primary();
    articles_table.string("title");
    articles_table.string("body");
    articles_table.integer("votes").defaultTo(0);
    articles_table.string("topic").references("users.username");
    articles_table.string("author");
    articles_table.timestamp("created_at");
  });
};

exports.down = function(knex) {
  console.log("in the down function");
  return knex.schema.dropTable("articles");
};
