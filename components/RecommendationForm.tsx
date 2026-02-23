'use client';

import { FormEvent, useState } from 'react';

import { ResultCard } from '@/components/ResultCard';
import { Purpose, RecommendationResult } from '@/utils/types';

const purposeOptions: { label: string; value: Purpose }[] = [
  { label: 'General', value: 'general' },
  { label: 'Clothes', value: 'clothes' },
  { label: 'Documents', value: 'documents' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Toys', value: 'toys' }
];

export function RecommendationForm() {
  const [width, setWidth] = useState(120);
  const [depth, setDepth] = useState(50);
  const [height, setHeight] = useState(80);
  const [purpose, setPurpose] = useState<Purpose>('general');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ width, depth, height, purpose })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'Unknown API error');
      }

      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Width (cm)
          <input type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} required />
        </label>
        <label>
          Depth (cm)
          <input type="number" min={1} value={depth} onChange={(e) => setDepth(Number(e.target.value))} required />
        </label>
        <label>
          Height (cm)
          <input type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} required />
        </label>
        <label>
          Purpose
          <select value={purpose} onChange={(e) => setPurpose(e.target.value as Purpose)}>
            {purposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Recommend'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {results.map((result) => (
          <ResultCard key={result.product.id} result={result} />
        ))}
      </div>
    </section>
  );
}
