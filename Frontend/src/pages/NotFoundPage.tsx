import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-center gap-12">
      <div className="md:w-1/2 max-w-xl">
        <img
          src="/errorPage.png"
          alt="404 Illustration"
          className="w-full h-auto"
        />
      </div>
      <div className="md:w-1/2 max-w-lg text-center md:text-left">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Seems like you got lost in the bookieverse
        </h2>
        <p className="text-gray-600 mb-8">
          You can either stay and chill here, or go back to the beginning.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;