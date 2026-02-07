import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-6xl font-bold text-gray-600">404</h1>
      <p className="text-gray-400 mt-2">Page not found.</p>
      <Link to="/" className="inline-block mt-6 px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition">
        Back to Home
      </Link>
    </div>
  );
}
