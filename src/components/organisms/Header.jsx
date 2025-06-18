import { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import QuickAddModal from '@/components/organisms/QuickAddModal'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'

const Header = ({ onSearch, onTaskAdded }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  return (
    <>
      <header className="flex-shrink-0 h-16 bg-surface border-b border-gray-700 px-6 z-40">
        <div className="h-full flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold font-display text-white">
              Tasker
            </h1>
          </motion.div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4 flex-1 max-w-2xl ml-8">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search tasks..."
              className="flex-1"
            />
            
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => setShowQuickAdd(true)}
              className="flex-shrink-0"
            >
              Add Task
            </Button>
          </div>

          {/* User Profile and Logout */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4 ml-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-medium">
                    {user.firstName?.charAt(0) || user.emailAddress?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-gray-300 text-sm">
                  {user.firstName || user.emailAddress}
                </span>
              </div>
              
              <Button
                variant="ghost"
                icon="LogOut"
                onClick={logout}
                className="text-gray-400 hover:text-white"
                size="sm"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onTaskAdded={(task) => {
          onTaskAdded?.(task)
          setShowQuickAdd(false)
        }}
      />
    </>
  )
}

export default Header