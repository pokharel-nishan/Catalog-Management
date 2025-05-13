import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={i}
            size={16}
            className={`${
              starValue <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } mr-0.5`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;