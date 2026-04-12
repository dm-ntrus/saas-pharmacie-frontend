import React from 'react';
import Link from 'next/link';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <Link
      href={href}
      className={`skip-link ${className}`}
      tabIndex={0}
    >
      {children}
    </Link>
  );
};

export const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only md:not-sr-only">
      <SkipLink href="#main-content">
        Aller au contenu principal
      </SkipLink>
      <SkipLink href="#navigation">
        Aller à la navigation
      </SkipLink>
      <SkipLink href="#footer">
        Aller au pied de page
      </SkipLink>
    </div>
  );
}; 