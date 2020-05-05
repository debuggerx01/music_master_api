import Bookshelf from "../helpers/bookshelf.config";

export default class Customer extends Bookshelf.Model<Customer> {
  get tableName() {
    return "customer";
  }

  get hasTimestamps() {
    return true;
  }

  static getCustomer(id: number) {
    const customer: Customer = Customer.forge();
    return customer.where("id", id).fetch();
  }

  static getCustomerByUnionId(unionId: number) {
    const customer = new Customer();
    return customer.where("union_id", unionId).fetch();
  }

  static createCustomer(
    unionId,
    openId,
    avatar,
    nickName,
  ) {
    const customer: Customer = Customer.forge();
    return customer.save(
      {
        unionId,
        openId,
        nickName,
        avatar,
      },
      { method: "insert" }
    );
  }

  static updateHighScore(id: number, score: number, master: string) {
    const customer: Customer = Customer.forge();
    return customer.where("id", id).fetch().then(res => {
      if (res.get("score") < score) {
        return customer.save(
          {
            id,
            score,
            master,
          },
          { method: "update" }
        );
      } else {
        return res;
      }
    });
  }

  // select avatar, nick_name, rank, score from (select *, rank() over (order by score desc ) as rank from customer) c where c.rank <= 10 or c.id = 9;
  static getRanking(id: number) {
    return Bookshelf.knex.raw(
      "select id, avatar, nick_name, rank, score from " +
      "(select *, rank() over (order by score desc )::integer  as rank from customer) c " +
      "where c.rank <= 30 or c.id = ?;",
      id
    ).then(res => {
      if (!res || res.rows.length === 0) {
        return [];
      }
      return res.rows;
    });
  }
}
