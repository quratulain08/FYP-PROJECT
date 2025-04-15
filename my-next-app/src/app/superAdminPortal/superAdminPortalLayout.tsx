"use client"

import type React from "react"
import  Navbar from "./navbar/page"

interface SuperAdminPortalLayoutProps {
  children: React.ReactNode
}

const SuperAdminPortalLayout: React.FC<SuperAdminPortalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">{children}</main>
    </div>
  )
}

export default SuperAdminPortalLayout

