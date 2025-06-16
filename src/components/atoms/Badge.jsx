import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-700 text-gray-300',
    primary: 'bg-gradient-to-r from-primary to-secondary text-white',
    secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
    high: 'bg-error/20 text-error border border-error/30',
    medium: 'bg-warning/20 text-warning border border-warning/30',
    low: 'bg-success/20 text-success border border-success/30'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const Component = animate ? motion.span : 'span'
  const motionProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Badge