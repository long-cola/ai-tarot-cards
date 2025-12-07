import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ path: ".env.server.local" });
dotenv.config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`[server] listening on ${HOST}:${PORT}`);
});
