import { NextRequest, NextResponse } from 'next/server';
import { searchTrailers } from '@/lib/api/tmdb';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const trailers = await searchTrailers(query.trim());
    return NextResponse.json(trailers);
  } catch {
    return NextResponse.json([]);
  }
}
