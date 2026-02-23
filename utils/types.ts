export type Purpose = 'general' | 'clothes' | 'documents' | 'kitchen' | 'toys';

export interface Product {
  id: number;
  name: string;
  brand: string;
  width_cm: number;
  depth_cm: number;
  height_cm: number;
  stackable: boolean;
  open_type: string;
  price: number;
  url: string;
  image_url: string;
}

export interface RecommendInput {
  width: number;
  depth: number;
  height: number;
  purpose: Purpose;
}

export interface RecommendationResult {
  product: Product;
  countWidth: number;
  countDepth: number;
  countHeight: number;
  totalCount: number;
  remainingWidthCm: number;
  remainingDepthCm: number;
  remainingHeightCm: number;
  remainingVolumeCm3: number;
  efficiency: number;
}
