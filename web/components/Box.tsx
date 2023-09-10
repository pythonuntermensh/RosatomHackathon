import React from "react";
import {twMerge} from 'tailwind-merge'

interface BoxProps {
  children: React.ReactNode
  className?: string
}

const Box: React.FC<BoxProps> = ({children, className}) => {
  return (
    <div className={twMerge(`
      box
      flex 
      flex-col 
      w-full
      p-4 
      items-center 
      justify-center 
      gap-y-4 
      bg-sky-400 
      bg-opacity-30 
      rounded-xl
      shadow-2xl
    `,
      className!
    )}>
      {children}
    </div>
  )
}

export default Box