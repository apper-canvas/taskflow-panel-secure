import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-4"
      >
        <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          variant="primary"
          icon="RefreshCw"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState