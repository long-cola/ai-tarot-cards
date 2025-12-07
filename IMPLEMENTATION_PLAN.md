# AI Tarot Projects – Execution Plan

This breaks the PRD into shippable milestones and clarifies domain rules so we can start implementing without re-reading the PRD each time.

## Milestones
- **M0 · Foundations**: Finalize domain model & quotas, extend DB schema (cycles, topics, events, usage), and align `/api/me` to expose plan/quota state. Keep legacy single-reading flow working.
- **M1 · Project Flow**: Homepage suggestions + question entry -> project creation with 3-card baseline reading; project list in header; project detail timeline (baseline cards + reading, event history); create event (1-card draw, AI prompt uses baseline + history).
- **M2 · Plans & Paywall**: Enforce free vs paid limits (topics/events), remaining capacity UI, paywall modal with plan comparison & redeem entry, expiry countdown banner (T-3 days) and downgrade logic after expiry.
- **M3 · Admin & Ops**: Admin endpoints/UI for redemption code creation (default 1 month), user stats (count, signup time, paid status/expiry, project counts, event logs), bilingual polish, and QA.

## Domain model & quotas
- **User**: Existing Google auth user; fields keep `membership_expires_at` plus **membership cycles** to reset quotas per upgrade.
- **MembershipCycle**: `id`, `user_id`, `plan` (`free|paid`), `starts_at`, `ends_at`, `topic_quota` (paid: 30 per month, 90 per 3 months; free: 1), `event_quota_per_topic` (paid: 500, free/downgraded: 3), `source` (redeem code). New redemption starts a new cycle from “now” (not cumulative with past).
- **Topic/Project**: `id`, `user_id`, `cycle_id`, `title`, `created_at`, `baseline_cards` (JSON of 3 cards), `baseline_reading` (Markdown), `language`, `status`. Counts toward the active cycle’s topic quota when created within that cycle.
- **TopicEvent**: `id`, `topic_id`, `cycle_id` (for counting within the cycle used), `name`, `cards` (usually 1), `reading`, `created_at`, `language`.
- **Quota rules**:
  - Free users: 1 topic; that topic max 3 events. Can view all history.
  - Paid cycle: 30 topics per paid month (or 90 for 3 months), each topic up to 500 events. Events are per-topic lifetime while the cycle is active.
  - Post-expiry: user is downgraded; can still view all topics/logs, cannot create new topics, and can only add events to the most recent topic with up to 3 events (free cap).
  - Renewal starts a fresh cycle from payment time with fresh quotas; past topics remain view-only unless within the downgraded free allowance.

## APIs to build
- `/api/me`: include `plan`, `cycle` window, remaining topic quota, per-topic remaining events, expiry, and downgrade flags.
- Topics: `POST /api/topics` (create with baseline cards/reading), `GET /api/topics` (list with counts), `GET /api/topics/:id` (detail + events), `POST /api/topics/:id/events` (create event + AI reading). All enforce quotas/login.
- Paywall: server returns `reason` and remaining counts to render paywall vs simple error.
- Admin: `POST /api/codes/generate` (already exists but extend for defaults/metadata) and `GET /api/admin/users` (stats with paid/expiry/project counts), `GET /api/admin/topics/:id` (optional deep detail).

## AI prompts
- **Baseline reading**: reuse current 3-card prompt.
- **Event reading**: use the provided single-card prompt; include `{project name}`, `{baseline cards}`, `{baseline reading summary}`, and `{event history}` in the prompt payload.

## UI/UX priorities
- Homepage keeps current input; add suggested questions (ZH/EN) quick-fill chips.
- After baseline reading, show a highlighted callout guiding user to start event logging.
- Header popover: plan badge, expiry time, remaining topic quota; link to project list.
- Project list page in header; detail page shows baseline cards/reading, event timeline, and “new event” flow (draw 1 card -> AI -> append).
- Capacity display: show remaining topics for the cycle; in topic detail show used/remaining events.
- Paywall modal when free limits exhausted; compare free vs paid, redeem code CTA (no online pay yet).
- Expiry banner (T-3 days) under nav for paid users.
- Full bilingual strings for new surfaces.

## Open questions / risks
- Need clarity on how to handle a user redeeming before current paid cycle ends (assume new cycle starts immediately, overwriting previous end).
- Admin interface form factor (built-in page vs external tooling) to be decided.
- We must reconcile dual API surfaces (`api/` serverless vs `server/` Express); suggest converging on one to avoid drift.
