exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("options", function(table) {
      table.increments("id");
      table.integer("question_id").notNullable();
      table.text("content");
      table.boolean("correct").defaultTo(false);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("options")]);
};
