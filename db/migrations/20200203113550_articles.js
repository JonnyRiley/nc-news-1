exports.up = function(knex) {
  return knex.schema.createTable("articles", function(articles_table) {
    articles_table.increments("article_id").primary();
    articles_table.string("title").notNullable();
    articles_table.text("body").notNullable();
    articles_table.integer("votes").defaultTo();
    articles_table.string("topic").references("topics.slug");
    articles_table.string("author").notNullable();
    articles_table.timestamp("created_at").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
