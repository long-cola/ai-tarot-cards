<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1PoGsmQxIAxGlh8RCaxYR9LgruITUW3Tv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `VITE_BAILIAN_API_KEY` in your environment (or `.env.local`) to your Alibaba Bailian API key
3. Configure server env in `.env.server.local` (see `.env.server.example`):
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `DATABASE_URL` (Neon)
   - `SESSION_SECRET`, `CLIENT_ORIGIN`, `SERVER_URL`, `ADMIN_CODE_SECRET`
4. Start backend (auth + quotas): `npm run server`
5. Start frontend: `npm run dev`

API base defaults to `http://localhost:3001`; override with `VITE_API_BASE_URL` if needed.
