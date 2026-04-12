import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage = React.memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  objectFit = 'cover',
}) => {
  // Validation des props
  if (!fill && (!width || !height)) {
    console.warn('OptimizedImage: width and height are required when fill is false');
  }

  const imageProps = {
    src,
    alt,
    className: cn('transition-opacity duration-300', className),
    priority,
    quality,
    placeholder,
    blurDataURL,
    sizes,
    fill,
    style: fill ? { objectFit } : undefined,
  };

  if (!fill) {
    imageProps.width = width;
    imageProps.height = height;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image {...imageProps} />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage }; 