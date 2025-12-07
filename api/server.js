import serverlessHttp from "serverless-http";
import { app } from "../server/app.js";

export const config = {
  runtime: "nodejs",
};

export default serverlessHttp(app);
