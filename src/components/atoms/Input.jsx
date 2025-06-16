import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  error,
  icon,
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-400
    focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
    transition-all duration-200
    ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
    ${icon ? 'pl-12' : ''}
    ${className}
  `

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input