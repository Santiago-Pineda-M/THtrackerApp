interface GuardProps {
  isAccess: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const Guard = ({ isAccess, children, fallback }: GuardProps) => {
  if (!isAccess) {
    return <>{fallback}</>
  }
  return <>{children}</>
}
