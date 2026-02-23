import { NextResponse } from 'next/server';

import products from '@/data/products.json';
import { calculateRecommendations } from '@/utils/calculate';
import { Purpose, RecommendInput } from '@/utils/types';

function parseInput(body: unknown): RecommendInput | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const maybe = body as Partial<RecommendInput>;
  const purpose = (maybe.purpose ?? 'general') as Purpose;
  const validPurposes: Purpose[] = ['general', 'clothes', 'documents', 'kitchen', 'toys'];

  if (!validPurposes.includes(purpose)) {
    return null;
  }

  const width = Number(maybe.width);
  const depth = Number(maybe.depth);
  const height = Number(maybe.height);

  if ([width, depth, height].some((v) => Number.isNaN(v) || v <= 0)) {
    return null;
  }

  return { width, depth, height, purpose };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseInput(body);

    if (!input) {
      return NextResponse.json({ error: 'Invalid input payload.' }, { status: 400 });
    }

    const results = calculateRecommendations(products, input).slice(0, 12);

    return NextResponse.json({
      input,
      meta: {
        marginCm: 1,
        gapCm: 0.5
      },
      totalResults: results.length,
      results
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process recommendation request.' }, { status: 500 });
  }
}
