import Bookshelf from "../helpers/bookshelf.config";

export default class Questions extends Bookshelf.Model<Questions> {
  get tableName() {
    return "questions";
  }

  get hasTimestamps() {
    return false;
  }

  get hidden() {
    return ["id", "tags"];
  }

  static getQuestions() {
    return Questions.forge<Questions>().orderBy("id").fetchAll();
  }
}
