import React, {forwardRef} from 'react'
import {twMerge} from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, children, disabled, type = 'button', ...props}, ref) => {
    return (
      <button
        type={type}
        className={twMerge(`
          box
          button 
          w-full
          h-14 
          md:h-16 
          bg-blue-500  
          select-none
          active:translate-y-2  
          active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px]
          transition-all 
          duration-50 
          [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
          rounded-full  
          border-[1px] 
          border-blue-500
          hover:opacity-75
        `,
          className!
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
