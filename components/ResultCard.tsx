import { RecommendationResult } from '@/utils/types';

interface ResultCardProps {
  result: RecommendationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { product } = result;

  return (
    <article className="card">
      <img src={product.image_url} alt={product.name} className="productImage" />
      <div className="cardContent">
        <h3>{product.name}</h3>
        <p>
          {product.brand} · ${product.price}
        </p>
        <p>
          {product.width_cm}W × {product.depth_cm}D × {product.height_cm}H cm
        </p>
        <p>Open Type: {product.open_type}</p>
        <p>Stackable: {product.stackable ? 'Yes' : 'No'}</p>
        <p>
          Layout: {result.countWidth} × {result.countDepth} × {result.countHeight}
        </p>
        <p>Total Count: {result.totalCount}</p>
        <p>Efficiency: {result.efficiency}%</p>
        <p>
          Remaining (W/D/H): {result.remainingWidthCm} / {result.remainingDepthCm} / {result.remainingHeightCm} cm
        </p>
        <a href={product.url} target="_blank" rel="noreferrer">
          View Product
        </a>
      </div>
    </article>
  );
}
