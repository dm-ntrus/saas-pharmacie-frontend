import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type OptimizedImageProps =
  | {
      src: string;
      alt: string;
      width: number;
      height: number;
      className?: string;
      priority?: boolean;
      quality?: number;
      placeholder?: 'blur' | 'empty';
      blurDataURL?: string;
      sizes?: string;
      fill?: false;
      objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    }
  | {
      src: string;
      alt: string;
      className?: string;
      priority?: boolean;
      quality?: number;
      placeholder?: 'blur' | 'empty';
      blurDataURL?: string;
      sizes?: string;
      fill: true;
      objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    };

const OptimizedImage = React.memo<OptimizedImageProps>((props) => {
  const {
    src,
    alt,
    className,
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    objectFit = 'cover',
  } = props as any;

  const wrapperClass = cn('relative overflow-hidden', className);
  const imgClass = cn('transition-opacity duration-300', className);

  if ('fill' in props && props.fill) {
    return (
      <div className={wrapperClass}>
        <Image
          src={src}
          alt={alt}
          className={imgClass}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          fill
          style={{ objectFit }}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <Image
        src={src}
        alt={alt}
        className={imgClass}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        width={(props as any).width}
        height={(props as any).height}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage }; 