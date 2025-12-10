/**
 * Reusable loading skeleton with shimmer animation
 * @param width - Width class (e.g., "w-20", "w-full")
 * @param height - Height class (e.g., "h-4", "h-8")
 * @param className - Additional Tailwind classes
 */
interface LoadingSkeletonProps {
  width?: string
  height?: string
  className?: string
}

export function LoadingSkeleton({ width = 'w-full', height = 'h-4', className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
  )
}

/**
 * Skeleton for sidebar account items
 */
export function AccountSkeleton() {
  return (
    <div className="px-6 py-2">
      <div className="flex items-center justify-between">
        <LoadingSkeleton width="w-24" height="h-4" />
        <LoadingSkeleton width="w-16" height="h-4" />
      </div>
    </div>
  )
}

/**
 * Skeleton for transaction table rows
 */
export function TransactionRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <LoadingSkeleton width="w-20" height="h-4" />
      </td>
      <td className="px-6 py-4">
        <LoadingSkeleton width="w-32" height="h-4" />
      </td>
      <td className="px-6 py-4">
        <LoadingSkeleton width="w-24" height="h-4" />
      </td>
      <td className="px-6 py-4">
        <LoadingSkeleton width="w-24" height="h-4" />
      </td>
      <td className="px-6 py-4">
        <LoadingSkeleton width="w-16" height="h-4" className="ml-auto" />
      </td>
    </tr>
  )
}
