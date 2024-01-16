import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const store: Record<string, { count: number; timestamp: number; blockUntil: number }> = {};

export const middleware = (req: NextRequest) => {
  let response = NextResponse.next();

  // if u want to limit all requests, use this
  if (req.nextUrl.pathname.startsWith('/')) {
    // use ip, uuid, or something else u want to limit
    const forwardedFor = headers().get('x-forwarded-for');
    let ip = forwardedFor ? forwardedFor.split(':')[0] : headers().get('x-real-ip');

    if (!ip) {
      ip = '0.0.0.0';
    }

    const now = Date.now();
    const windowMs = 30 * 1000; // duration 30 seconds
    const blockDuration = 30 * 1000; // block duration 30 seconds
    const max = 30; // max requests per windowMs

    if (!store[ip] || (now > store[ip].timestamp && now > store[ip].blockUntil)) {
      store[ip] = { count: 1, timestamp: now + windowMs, blockUntil: 0 };
    } else if (store[ip].count < max) {
      store[ip].count++;
    } else {
      store[ip].blockUntil = now + blockDuration;

      response = NextResponse.json({ error: `Too Many Requests, try after 30 seconds.`  }, { status: 429 });
    }
  }

  return response;
};
