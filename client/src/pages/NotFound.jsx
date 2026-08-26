import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container empty-state" style={{ padding: '90px 20px' }}>
      <h3 style={{ fontSize: 44, marginBottom: 12 }}>404</h3>
      <p>We couldn&rsquo;t find the page you were looking for.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
