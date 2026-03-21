import React from 'react';

export function Badge({ children, variant = 'info', className = '', ...props }) {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide";
  
  const variants = {
    new: "bg-green-100 text-green-800",
    sale: "bg-red-100 text-red-800",
    info: "bg-brand-light text-brand-navy",
    warning: "bg-brand-yellow text-yellow-900"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
