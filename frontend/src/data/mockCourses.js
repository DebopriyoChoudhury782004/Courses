// Mock course data – Home page always displays this list; Course Detail uses it for mock IDs.
export const MOCK_COURSES = [
  {
    _id: 'mock-1',
    title: 'React Fundamentals',
    description: 'Learn React from scratch: components, hooks, and state management. Build modern UIs with confidence.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
  },
  {
    _id: 'mock-2',
    title: 'Node.js & Express Backend',
    description: 'Build scalable REST APIs with Node.js and Express. Authentication, MongoDB, and deployment.',
    price: 49.99,
    image: 'https://images.ctfassets.net/aq13lwl6616q/7cS8gBoWulxkWNWEm0FspJ/c7eb42dd82e27279307f8b9fc9b136fa/nodejs_cover_photo_smaller_size.png?w=500&fm=webp',
  },
  {
    _id: 'mock-3',
    title: 'MongoDB Mastery',
    description: 'Master MongoDB: schemas, aggregation, indexing, and Mongoose ODM. From basics to production.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
  },
  {
    _id: 'mock-4',
    title: 'TailwindCSS for Rapid UI',
    description: 'Ship beautiful, responsive interfaces fast with TailwindCSS. Utility-first CSS and component patterns.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
  },
  {
    _id: 'mock-5',
    title: 'JWT & Secure Auth',
    description: 'Implement JWT authentication, refresh tokens, and secure APIs. Best practices for production.',
    price: 29.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR7hpJZMIYMYk0vtHPFrLd9n0C2jP1rVVK7Q&s',
  },
];

export function getMockCourseById(id) {
  return MOCK_COURSES.find((c) => c._id === id) || null;
}

export function isMockCourseId(id) {
  return typeof id === 'string' && MOCK_COURSES.some((c) => c._id === id);
}
