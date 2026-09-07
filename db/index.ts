import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Resilient DNS resolver using public DNS (Google 8.8.8.8, Cloudflare 1.1.1.1, Google 8.8.4.4)
// to prevent "TypeError: fetch failed" / ENOTFOUND errors on networks with restrictive/buggy DNS relays.
if (typeof window === "undefined") {
  try {
    const dns = require("node:dns");
    const https = require("node:https");
    const fallbackResolver = new dns.promises.Resolver();
    fallbackResolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

    const customLookup = (
      hostname: string,
      options: any,
      cb?: (err: any, address: any, family?: number) => void
    ) => {
      const callback = (typeof options === "function" ? options : cb) as (
        err: any,
        address: any,
        family?: number
      ) => void;
      const opts = typeof options === "object" ? options : {};

      dns.lookup(hostname, opts, (err: any, addr: any, family: any) => {
        if (!err) {
          return callback(null, addr, family);
        }
        fallbackResolver
          .resolve4(hostname)
          .then((addrs: string[]) => {
            if (opts && opts.all) {
              callback(
                null,
                addrs.map((a: string) => ({ address: a, family: 4 }))
              );
            } else {
              callback(null, addrs[0], 4);
            }
          })
          .catch((fallbackErr: any) => {
            callback(err || fallbackErr, undefined, undefined);
          });
      });
    };

    neonConfig.fetchFunction = async (url: string, options: any) => {
      try {
        return await fetch(url, options);
      } catch (err: any) {
        return new Promise((resolve, reject) => {
          try {
            const u = new URL(url);
            const headers: Record<string, string> = {};
            if (options?.headers) {
              if (typeof options.headers.forEach === "function") {
                options.headers.forEach((v: string, k: string) => {
                  headers[k] = v;
                });
              } else {
                Object.assign(headers, options.headers);
              }
            }
            const req = https.request(
              {
                hostname: u.hostname,
                port: u.port || 443,
                path: u.pathname + u.search,
                method: options?.method || "GET",
                headers,
                lookup: customLookup,
              },
              (res: any) => {
                const chunks: Buffer[] = [];
                res.on("data", (c: any) => chunks.push(c));
                res.on("end", () => {
                  const buffer = Buffer.concat(chunks);
                  resolve(
                    new Response(buffer, {
                      status: res.statusCode,
                      statusText: res.statusMessage,
                      headers: res.headers as any,
                    })
                  );
                });
              }
            );
            req.on("error", reject);
            if (options?.body) {
              req.write(options.body);
            }
            req.end();
          } catch (innerErr) {
            reject(err || innerErr);
          }
        });
      }
    };
  } catch {
    // Fallback gracefully if node modules are not accessible
  }
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  "postgresql://neondb_owner:npg_LneXBY6h5wgo@ep-tiny-scene-azc349u2-pooler.c-3.ap-southeast-1.aws.neon.tech/ganapati-mandal-invitations?sslmode=require&channel_binding=require";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

