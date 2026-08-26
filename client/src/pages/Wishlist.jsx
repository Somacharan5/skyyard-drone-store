import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart } from '../icons/Icon';
import './account/Account.css';

export default function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    client.get('/products', { params: { ids: ids.join(',') } }).then((res) => setProducts(res.data.products));
  }, [ids]);

  if (ids.length === 0) {
    return (
      <div className="container empty-state">
        <Heart size={40} style={{ margin: '0 auto 16px', color: 'var(--color-text-faint)' }} />
        <h3>Your wishlist is empty</h3>
        <p>Tap the heart icon on any product to save it here.</p>
        <Link to="/shop" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container account-page">
      <h1>My Wishlist</h1>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
