import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getMockCourseById, isMockCourseId } from '../data/mockCourses';

const VALID_PROMO = 'BFSALE25';
const PROMO_DISCOUNT = 50;

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(() => getMockCourseById(id) ?? null);
  const [loading, setLoading] = useState(!isMockCourseId(id));
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (isMockCourseId(id)) {
      setCourse(getMockCourseById(id));
      setLoading(false);
      return;
    }
    let cancelled = false;
    api.get(`/courses/${id}`)
      .then(({ data }) => { if (!cancelled) setCourse(data); })
      .catch(() => { if (!cancelled) toast.error('Course not found'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const isFree = course?.price === 0;
  const canSubscribe = isFree || promoApplied;
  const discountedPrice = course && course.price > 0 && promoApplied
    ? (course.price * (100 - PROMO_DISCOUNT)) / 100
    : null;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === VALID_PROMO) {
      setPromoApplied(true);
      toast.success('Promo code applied! 50% off.');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/course/${id}` } } });
      return;
    }
    if (!canSubscribe) return;
    if (isMockCourseId(id)) {
      toast('Demo course. Start the backend and use seeded courses to subscribe.', { icon: 'ℹ️' });
      return;
    }
    setSubscribing(true);
    try {
      await api.post('/subscribe', {
        courseId: id,
        ...(course.price > 0 && { promoCode: promoCode.trim() || VALID_PROMO }),
      });
      toast.success('Subscribed successfully!');
      navigate('/my-courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400">Course not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-400 hover:underline">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-dark-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="aspect-video bg-gray-800">
          {course.image ? (
            <img src={course.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-6xl">📚</div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{course.title}</h1>
          <p className="text-gray-400 mt-2 leading-relaxed">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {course.price === 0 ? (
              <span className="text-xl font-semibold text-green-400">Free</span>
            ) : (
              <div className="flex items-center gap-2">
                {promoApplied && (
                  <span className="text-gray-500 line-through">${course.price.toFixed(2)}</span>
                )}
                <span className="text-xl font-semibold text-primary-400">
                  ${(discountedPrice ?? course.price).toFixed(2)}
                </span>
                {promoApplied && <span className="text-sm text-green-400">(50% off)</span>}
              </div>
            )}
          </div>

          {course.price > 0 && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">Promo code (required for paid courses)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. BFSALE25"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={promoApplied}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoApplied}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-sm font-medium transition"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            {!isAuthenticated ? (
              <p className="text-gray-400 text-sm mb-2">Log in to subscribe.</p>
            ) : null}
            <button
              onClick={handleSubscribe}
              disabled={!canSubscribe || subscribing}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white transition"
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">← Back</button>
      </p>
    </div>
  );
}
