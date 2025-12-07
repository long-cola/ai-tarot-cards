import serverlessHttp from "serverless-http";
import { app } from "../server/app.js";

export const config = {
  runtime: "nodejs20.x",
  maxDuration: 30,
};

export default serverlessHttp(app);
