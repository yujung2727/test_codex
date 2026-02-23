import { Product, Purpose, RecommendInput, RecommendationResult } from '@/utils/types';

const OUTER_MARGIN_CM = 1;
const GAP_CM = 0.5;

const PURPOSE_KEYWORDS: Record<Purpose, string[]> = {
  general: [],
  clothes: ['wardrobe', 'drawer', 'underbed'],
  documents: ['file', 'office', 'crate'],
  kitchen: ['kitchen', 'pantry', 'caddy'],
  toys: ['toy', 'cube', 'chest']
};

function filterByPurpose(products: Product[], purpose: Purpose): Product[] {
  if (purpose === 'general') {
    return products;
  }

  const keywords = PURPOSE_KEYWORDS[purpose];
  return products.filter((product) => {
    const searchable = `${product.name} ${product.open_type}`.toLowerCase();
    return keywords.some((keyword) => searchable.includes(keyword));
  });
}

function fitCount(inner: number, item: number): number {
  if (inner <= 0 || item <= 0 || item > inner) {
    return 0;
  }

  return Math.floor((inner + GAP_CM) / (item + GAP_CM));
}

export function calculateRecommendations(
  products: Product[],
  input: RecommendInput
): RecommendationResult[] {
  const innerWidth = Math.max(0, input.width - OUTER_MARGIN_CM * 2);
  const innerDepth = Math.max(0, input.depth - OUTER_MARGIN_CM * 2);
  const innerHeight = Math.max(0, input.height - OUTER_MARGIN_CM * 2);

  if (innerWidth <= 0 || innerDepth <= 0 || innerHeight <= 0) {
    return [];
  }

  const candidateProducts = filterByPurpose(products, input.purpose);

  const recommendations = candidateProducts
    .map((product) => {
      const countWidth = fitCount(innerWidth, product.width_cm);
      const countDepth = fitCount(innerDepth, product.depth_cm);

      const countHeight = product.stackable
        ? Math.floor(innerHeight / product.height_cm)
        : product.height_cm <= innerHeight
          ? 1
          : 0;

      const totalCount = countWidth * countDepth * countHeight;
      if (totalCount === 0) {
        return null;
      }

      const usedWidth = countWidth > 0 ? countWidth * product.width_cm + (countWidth - 1) * GAP_CM : 0;
      const usedDepth = countDepth > 0 ? countDepth * product.depth_cm + (countDepth - 1) * GAP_CM : 0;
      const usedHeight = countHeight * product.height_cm;

      const containerVolume = innerWidth * innerDepth * innerHeight;
      const usedVolume = totalCount * product.width_cm * product.depth_cm * product.height_cm;
      const remainingVolumeCm3 = Math.max(0, containerVolume - usedVolume);

      const efficiency = containerVolume > 0 ? (usedVolume / containerVolume) * 100 : 0;

      return {
        product,
        countWidth,
        countDepth,
        countHeight,
        totalCount,
        remainingWidthCm: Number(Math.max(0, innerWidth - usedWidth).toFixed(2)),
        remainingDepthCm: Number(Math.max(0, innerDepth - usedDepth).toFixed(2)),
        remainingHeightCm: Number(Math.max(0, innerHeight - usedHeight).toFixed(2)),
        remainingVolumeCm3: Number(remainingVolumeCm3.toFixed(2)),
        efficiency: Number(efficiency.toFixed(2))
      } satisfies RecommendationResult;
    })
    .filter((item): item is RecommendationResult => item !== null)
    .sort((a, b) => {
      if (b.totalCount !== a.totalCount) {
        return b.totalCount - a.totalCount;
      }

      return b.efficiency - a.efficiency;
    });

  return recommendations;
}
