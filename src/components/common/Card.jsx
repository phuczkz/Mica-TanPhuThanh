import React from 'react';

export function Card({ children, className = '', hoverable = false, ...props }) {
  const baseStyles = "bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden";
  const hoverStyles = hoverable ? "transition-transform duration-300 hover:shadow-md hover:-translate-y-1" : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
