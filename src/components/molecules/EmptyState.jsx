import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  icon = 'Package',
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-6"
      >
        <ApperIcon name={icon} size={64} className="text-gray-600 mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-medium text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState