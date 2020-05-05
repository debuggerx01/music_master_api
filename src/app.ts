import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as compression from "compression";
import * as config from "config";
import * as express from "express";
import * as helmet from "helmet";
import * as validator from "express-validator";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import timezone from "./middlewares/timezone";
import addContext from "./middlewares/addContext";
import jobs from "./jobs";
import fetchQuestions from "./helpers/fetchQuestions";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initialize();
    fetchQuestions();
    jobs();
  }

  private initialize(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(bodyParser.json({ limit: "10mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
    this.app.use(validator());
    this.app.use(addContext());
    this.app.use(timezone());
    const router = routes();
    this.app.use(`/${config.get("api.version")}`, router);
    this.app.use(errorHandler());
    this.app.use(express.static("../"));
  }
}

export default new App().app;
