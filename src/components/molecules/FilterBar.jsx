import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  className = '' 
}) => {
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Due Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'upcoming', label: 'Upcoming' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]

  const hasActiveFilters = 
    filters.priority !== 'all' || 
    filters.dueDate !== 'all' || 
    filters.status !== 'all'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg border border-gray-700 p-4 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <ApperIcon name="Flag" size={16} className="text-gray-400" />
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date Filter */}
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" size={16} className="text-gray-400" />
          <select
            value={filters.dueDate || 'all'}
            onChange={(e) => onFilterChange({ dueDate: e.target.value })}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <ApperIcon name="CheckCircle" size={16} className="text-gray-400" />
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClearFilters}
              className="text-gray-400 hover:text-white"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default FilterBar