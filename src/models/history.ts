import Bookshelf from "../helpers/bookshelf.config";
import moment = require("moment");

export default class History extends Bookshelf.Model<History> {
  get tableName() {
    return "history";
  }

  get hasTimestamps() {
    return true;
  }

  get hidden() {
    return ["id"];
  }

  static getHistory(customerId) {
    return History.forge<History>().where("customer_id", customerId).orderBy("created_at", "DESC").fetchAll();
  }

  static saveHistory(customerId, score, process) {
    return History.forge<History>().save(
      {
        customer_id: customerId,
        score,
        metadata: JSON.stringify(process),
      },
      { method: "insert" }
    );
  }

  static async countToday(customerId) {
    const history = await this.getHistory(customerId);
    const today = moment().dayOfYear();
    let count = 0;
    for (const h of history.toJSON()) {
      if (moment(h.createdAt).dayOfYear() === today) {
        count++;
        if (count > 3)
          break;
      }
    }
    return count;
  }

  static async canPlayToday(customerId) {
    return await this.countToday(customerId) < 3;
  }
}
