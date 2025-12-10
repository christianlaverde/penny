import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

interface LayoutProps {
  children: ReactNode
}

/**
 * Main layout with sidebar (desktop) and bottom nav (mobile)
 * 2-column layout on desktop (768px+), single column on mobile
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      {/* Desktop: 2-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile: Bottom navigation */}
      <MobileNav />
    </div>
  )
}
