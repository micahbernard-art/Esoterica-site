/** Minimal runtime bindings used by this project without the full Workers type package. */
declare module "cloudflare:workers" {
  export const env: {
    DB?: import("drizzle-orm/d1").AnyD1Database;
  };
}
