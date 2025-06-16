import { motion } from 'framer-motion'

const SkeletonLoader = ({ 
  count = 1, 
  height = 'h-4', 
  width = 'w-full',
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${height} ${width} bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse`}
        />
      ))}
    </div>
  )
}

export default SkeletonLoader