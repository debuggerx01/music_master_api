import * as config from "config";
import * as knex from "knex";
import * as bookshelf from "bookshelf";

const database: any = config.get("database");
database.connection.timezone = config.get("timezone");
database.pool = {
  afterCreate: function(conn, done) {
    conn.query(`SET timezone="${config.get("timezone")}";`, function(err) {
      done(err, conn);
    });
  }
};
const Bookshelf = bookshelf(knex(database));

Bookshelf.plugin([
  "registry",
  "visibility",
  "virtuals",
  "pagination",
  "bookshelf-camelcase"
]);

export default Bookshelf;
