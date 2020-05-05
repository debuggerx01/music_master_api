import * as config from "config";
import app from "./app";

const port = config.get("port");
app.listen(port, () => {
  console.log("Express server listening on port " + port);
});
