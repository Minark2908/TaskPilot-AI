import type { FC } from 'react';
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent border-primary ${sizeMap[size]}`}
        style={{ borderStyle: 'solid', borderColor: '#14B8A6' }}
      />
    </div>
  );
};
