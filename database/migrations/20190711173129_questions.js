exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("questions", function(table) {
      table.increments("id");
      table.text("content");
      table.text("tags");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("questions")]);
};
