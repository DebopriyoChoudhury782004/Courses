import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { MOCK_COURSES } from '../data/mockCourses';

export default function Home() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/courses')
      .then(({ data }) => {
        if (!cancelled && data && data.length > 0) setCourses(data);
      })
      .catch(() => {
        if (!cancelled) setCourses(MOCK_COURSES);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Black Friday Course Deals
        </h1>
        <p className="text-gray-400">
          Subscribe to courses. Use promo{' '}
          <code className="bg-gray-800 px-2 py-0.5 rounded text-primary-400">BFSALE25</code> for 50% off paid courses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/course/${course._id}`}
            className="group block bg-dark-800 border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition shadow-lg"
          >
            <div className="aspect-video bg-gray-800 overflow-hidden">
              {course.image ? (
                <img
                  src={course.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                  📚
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-display font-semibold text-lg text-white group-hover:text-primary-400 transition line-clamp-1">
                {course.title}
              </h2>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{course.description}</p>
              <p className="mt-3 font-medium">
                {course.price === 0 ? (
                  <span className="text-green-400">Free</span>
                ) : (
                  <span className="text-primary-400">${Number(course.price).toFixed(2)}</span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
