exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("history", function(table) {
      table.increments("id");
      table.integer("customer_id");
      table.integer("score").defaultTo(0);
      table.json("metadata");
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("history")]);
};
