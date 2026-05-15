const Avatar = ({ name = 'User', size = 'md' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const sizes = {
    sm: 'h-9 w-9 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-lg',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-center font-bold text-white ${sizes[size] || sizes.md}`}
    >
      {initials || 'U'}
    </div>
  );
};

export default Avatar;
