import type { NextFetchEvent, NextRequest } from 'next/server';

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // return your new response;
  //console.log('request', request, 'Event', event);
}