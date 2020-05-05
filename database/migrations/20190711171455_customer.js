exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("customer", function(table) {
      table.increments("id");
      table.string("open_id", 128).notNullable();
      table.string("union_id", 128).notNullable();
      table.text("avatar");
      table.string("nick_name", 128);
      table.integer("score").defaultTo(0);
      table.string("master", 64);
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("customer")]);
};
