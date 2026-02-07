import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get('/my-courses')
      .then(({ data }) => { if (!cancelled) setCourses(data); })
      .catch(() => { if (!cancelled) toast.error('Failed to load your courses'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-white mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <div className="bg-dark-800 border border-gray-700 rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">You haven’t subscribed to any courses yet.</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 font-medium">Browse courses →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col sm:flex-row gap-4 bg-dark-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition"
            >
              <div className="w-full sm:w-32 aspect-video sm:aspect-square flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                {sub.image ? (
                  <img src={sub.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">📚</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/course/${sub.courseId}`} className="font-display font-semibold text-lg text-white hover:text-primary-400 transition">
                  {sub.title}
                </Link>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{sub.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <span className="text-primary-400">Price paid: ${Number(sub.pricePaid).toFixed(2)}</span>
                  <span className="text-gray-500">
                    Subscribed: {new Date(sub.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
