import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "./db.js";

const allowedProvider = "google";

export const configurePassport = ({ googleClientId, googleClientSecret, callbackURL }) => {
  if (!googleClientId || !googleClientSecret) {
    console.warn("[auth] Google OAuth is not configured. Login will be unavailable.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          if (!pool) return done(new Error("Database not configured"));

          const googleId = profile.id;
          const email = profile.emails?.[0]?.value || null;
          const name = profile.displayName || null;
          const avatar = profile.photos?.[0]?.value || null;

          const existing = await pool.query(
            `select * from users where provider = $1 and provider_id = $2 limit 1`,
            [allowedProvider, googleId]
          );

          let user;
          if (existing.rows.length) {
            user = existing.rows[0];
            await pool.query(
              `update users set email=$1, name=$2, avatar=$3, updated_at=now() where id=$4`,
              [email, name, avatar, user.id]
            );
          } else {
            const insert = await pool.query(
              `insert into users (provider, provider_id, email, name, avatar) values ($1,$2,$3,$4,$5) returning *`,
              [allowedProvider, googleId, email, name, avatar]
            );
            user = insert.rows[0];
          }

          return done(null, { id: user.id, email, name, avatar, membership_expires_at: user.membership_expires_at });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (!pool) return done(new Error("Database not configured"));
      const result = await pool.query(
        `select id, email, name, avatar, membership_expires_at from users where id=$1 limit 1`,
        [id]
      );
      if (!result.rows.length) return done(null, false);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });
};
