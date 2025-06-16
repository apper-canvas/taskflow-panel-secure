import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  className = '',
  size = 'md',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <motion.div
      className={`
        relative cursor-pointer ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && onChange?.(!checked)}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <motion.div
        className={`
          w-full h-full rounded border-2 transition-all duration-200
          ${checked 
            ? 'bg-gradient-to-r from-primary to-secondary border-primary' 
            : 'border-gray-600 hover:border-gray-500'
          }
        `}
        animate={{ 
          scale: checked ? [1, 1.1, 1] : 1,
          backgroundColor: checked ? ['#6366F1', '#8B5CF6'] : '#374151'
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: checked ? 1 : 0, 
          opacity: checked ? 1 : 0 
        }}
        transition={{ duration: 0.2, delay: checked ? 0.1 : 0 }}
      >
        <ApperIcon 
          name="Check" 
          size={iconSizes[size]} 
          className="text-white" 
        />
      </motion.div>
      
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
    </motion.div>
  )
}

export default Checkbox