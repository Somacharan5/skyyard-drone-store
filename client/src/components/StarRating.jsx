import { Star } from '../icons/Icon';

export default function StarRating({ rating = 0, size = 14, count }) {
  const full = Math.round(rating * 2) / 2;
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < full ? '' : 'star-empty'} />
      ))}
      {count !== undefined && <span className="stars-count">({count})</span>}
    </span>
  );
}
