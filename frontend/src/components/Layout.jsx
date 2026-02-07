import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 bg-dark-800/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl text-primary-400">
            Black Friday Courses
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-courses" className="text-gray-300 hover:text-white transition">My Courses</Link>
                <span className="text-gray-500 text-sm hidden sm:inline">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-800 py-4 text-center text-gray-500 text-sm">
        Mini Course Subscription – Black Friday Edition · Mock payments only
      </footer>
    </div>
  );
}
