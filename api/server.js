import serverlessHttp from "serverless-http";
import { app } from "../server/app.js";

// Vercel serverless function configuration
// Note: runtime must be "nodejs" (not "nodejs20.x")
export const config = {
  maxDuration: 30,
};

export default serverlessHttp(app);
