import { RecommendationForm } from '@/components/RecommendationForm';

export default function HomePage() {
  return (
    <main className="container">
      <h1>FitMySpace</h1>
      <p>Enter your available shelf or closet dimensions to get product recommendations.</p>
      <RecommendationForm />
    </main>
  );
}
