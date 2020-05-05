import * as config from "config";
import * as moment from "moment";

export default class App {
  static getApp() {
    const event: any = config.get("event");
    const interval =
      (new Date().valueOf() -
        moment(event.startedAt, "YYYY-MM-DD")
          .toDate()
          .valueOf()) /
      (1000 * 3600 * 24);
    let status,
      dayIndex = 0,
      dailyThreshold = 0;
    if (interval < 0) {
      status = "preload";
    } else if (interval < event.totalDays) {
      status = "progress";
      dayIndex = Number.parseInt(Math.floor(interval).toString());
      dailyThreshold = event.scoreDailyThreshold[dayIndex];
      dayIndex += 1;
    } else {
      status = "finished";
    }

    return {
      status,
      startedAt: event.startedAt,
      dayIndex,
      totalDays: event.totalDays,
      dailyThreshold,
      dailyRemainingMs:
        moment()
          .endOf("day")
          .valueOf() - moment().valueOf()
    };
  }

  static getDailyThreshold(dayIndex) {
    const event: any = config.get("event");
    if (dayIndex < 1 || dayIndex > event.totalDays) return 0;
    return event.scoreDailyThreshold[dayIndex - 1];
  }
}
