
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
  totalStars?: number;
  disabled?: boolean;
};

export function StarRating({ rating, onRatingChange, totalStars = 5, disabled = false }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => !disabled && onRatingChange(ratingValue)}
              className="sr-only"
              disabled={disabled}
            />
            <Star
              className={cn(
                "h-6 w-6 cursor-pointer transition-colors",
                ratingValue <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                disabled && "cursor-not-allowed opacity-70"
              )}
              onMouseEnter={() => !disabled && setHover(ratingValue)}
              onMouseLeave={() => !disabled && setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}
