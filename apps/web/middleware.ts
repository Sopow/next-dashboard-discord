import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import env from "~/src/env";
import rateLimiter from "~/src/utils/rateLimit";
import ip from "request-ip";

const PUBLIC_FILE = /\.(.*)$/;

const options = {
  host: env.REDIS_HOST!,
  port: parseInt(env.REDIS_PORT!, 10),
};

const client = new Redis({ ...options });
const LIMIT_PER_SECOND = 3;
const DURATION = 60;


export async function middleware(req: NextRequest) {
  console.log('middleware');
  if(req.nextUrl.pathname.includes('/api/')) {
    console.log('middleware api');
    // Apply rate limiting
    const result = await rateLimiter(client, ip.getClientIp(req), LIMIT_PER_SECOND, DURATION);

    if (!result.success) {
      return NextResponse.json({
        message: "Too many requests",
        limit: result.limit,
        remaining: result.remaining,
        status: 429,
      });
    }
  }
  // Redirect to default locale
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    // req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  if (req.nextUrl.locale === "default") {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";

    return NextResponse.redirect(
      new URL(
        `/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`,
        req.url,
      ),
    );
  }
}