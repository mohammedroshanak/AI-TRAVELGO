import React from 'react'

export const Button = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"
