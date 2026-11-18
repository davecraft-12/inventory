import React from 'react';
import { Loader2 } from 'lucide-react';

const SIZES = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

const SpinnerContent = ({ size = 'md', text = 'Loading...', className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    <Loader2 size={SIZES[size]} className="animate-spin text-blue-600" />
    {text && (
      <p className="text-sm text-gray-600 animate-pulse">{text}</p>
    )}
  </div>
);

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <SpinnerContent size={size} text={text} className={className} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <SpinnerContent size={size} text={text} className={className} />
    </div>
  );
};

export default LoadingSpinner;