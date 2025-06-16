import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  change,
  className = '' 
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-surface rounded-lg border border-gray-700 p-6 transition-all duration-200
        hover:border-gray-600 hover:shadow-lg hover:shadow-primary/5
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={change.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={`mr-1 ${
                  change.type === 'increase' ? 'text-success' : 'text-error'
                }`}
              />
              <span className={`text-sm ${
                change.type === 'increase' ? 'text-success' : 'text-error'
              }`}>
                {change.value}
              </span>
            </div>
          )}
        </div>

        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center border
          ${colorClasses[color]}
        `}>
          <ApperIcon name={icon} size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard