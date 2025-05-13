import React from 'react';
import { 
  getTopDeals, 
  getBestSellers, 
  getNewArrivals, 
  getNewReleases, 
  getComingSoon 
} from '../../../data/book';
import BookSection from '../books/BookSection';

const HomeComponent: React.FC = () => {
  return (
    <div>
      <BookSection title="Top Deals" books={getTopDeals()} />
      <BookSection title="Best Sellers" books={getBestSellers()} />
      <BookSection title="New Arrivals" books={getNewArrivals()} />
      <BookSection title="New Releases" books={getNewReleases()} />
      <BookSection title="Coming Soon" books={getComingSoon()} />
    </div>
  );
};

export default HomeComponent;