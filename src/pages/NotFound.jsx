import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
    <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">404</p>
    <h1 className="mt-3 text-4xl font-extrabold text-on-surface">Page not found</h1>
    <p className="mt-3 max-w-md text-sm text-on-surface-variant">
      The page you are looking for does not exist or may have been moved.
    </p>
    <Link to="/" className="btn-primary mt-6 inline-flex items-center">Back to dashboard</Link>
  </div>
);

export default NotFound;
