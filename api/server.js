import serverlessHttp from "serverless-http";
import { app } from "../server/app.js";

export const config = {
  runtime: "nodejs18.x",
};

export default serverlessHttp(app);
