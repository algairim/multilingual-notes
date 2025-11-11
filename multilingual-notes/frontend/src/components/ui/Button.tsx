import React, { forwardRef } from 'react';

// Define variants and sizes for the button
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  outline:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-blue-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-5 py-2.5 text-base font-medium',
  icon: 'h-9 w-9 flex-shrink-0 items-center justify-center p-0',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-md border
          border-transparent font-medium shadow-sm
          transition-colors duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
