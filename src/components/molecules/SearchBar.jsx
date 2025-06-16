import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...",
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ 
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={16} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
        />
        
        {query && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar