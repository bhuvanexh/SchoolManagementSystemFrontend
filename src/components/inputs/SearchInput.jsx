import { Search } from 'lucide-react';

const SearchInput = ({ className = '', ...props }) => (
  <div className={`relative ${className}`.trim()}>
    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
    <input className="input-field pl-11" {...props} />
  </div>
);

export default SearchInput;
