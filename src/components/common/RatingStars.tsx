// ============================================================
// RATING STARS — Reusable star rating display component
// Converts a 0-10 score to 5-star visual display
// ============================================================

interface RatingStarsProps {
  /** Score on a 0-10 scale */
  score: number;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show numeric score next to stars */
  showScore?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const SCORE_SIZE_MAP = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function RatingStars({ score, size = 'sm', showScore = false, className = '' }: RatingStarsProps) {
  const starCount = 5;
  const filledStars = Math.round((score || 0) / 2);
  const sizeClass = SIZE_MAP[size];
  const scoreClass = SCORE_SIZE_MAP[size];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" role="img" aria-label={`${score} out of 10`}>
        {[...Array(starCount)].map((_, i) => (
          <svg
            key={i}
            className={`${sizeClass} ${
              i < filledStars
                ? 'text-yellow-400'
                : 'text-gray-200 dark:text-gray-700'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showScore && (
        <span className={`${scoreClass} text-gray-500 dark:text-gray-400 font-medium`}>
          {score}/10
        </span>
      )}
    </div>
  );
}
