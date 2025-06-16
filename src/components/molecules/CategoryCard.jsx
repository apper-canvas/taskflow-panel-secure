import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const CategoryCard = ({ 
  category, 
  isActive = false,
  className = '' 
}) => {
  const linkPath = category.id === 'all' ? '/dashboard' : `/category/${category.id}`

  return (
    <NavLink
      to={linkPath}
      className={({ isActive: linkActive }) => `
        block w-full ${className}
        ${linkActive ? 'ring-2 ring-primary' : ''}
      `}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          p-4 rounded-lg border transition-all duration-200 cursor-pointer
          ${isActive 
            ? 'bg-primary/10 border-primary text-primary' 
            : 'bg-surface border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <ApperIcon 
                name={category.icon} 
                size={18} 
                style={{ color: category.color }}
              />
            </div>
            
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-gray-400">
                {category.taskCount} {category.taskCount === 1 ? 'task' : 'tasks'}
              </p>
            </div>
          </div>

          {category.taskCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${isActive ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              {category.taskCount}
            </motion.div>
          )}
        </div>
      </motion.div>
    </NavLink>
  )
}

export default CategoryCard