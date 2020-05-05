import Bookshelf from "../helpers/bookshelf.config";

export default class Options extends Bookshelf.Model<Options> {
  get tableName() {
    return "options";
  }

  get hasTimestamps() {
    return false;
  }

  get hidden() {
    return ["id", "questionId"];
  }

  static getOptions() {
    return Options.forge<Options>().orderBy("question_id").fetchAll();
  }
}
